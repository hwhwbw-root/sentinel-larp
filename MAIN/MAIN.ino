#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>

#include "BoxID.h"
#include "WiFiReset.h"
#include "TFTDisplay.h"
#include "DHTSensor.h"
#include "Buzzer.h"
#include "AZP_OTA.h"
#include "RGBLed.h"
#include "Pins.h"
#include "Sensor.h" 
#include <WiFi.h>
#include <WiFiManager.h>

#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <time.h>
#include <math.h>

// ===== NEW: Supabase service module =====
#include "SupabaseService.h"  // <<<<< CRITICAL: MUST COME AFTER BoxID.h

// ===== Remote Logger for gas sensor TX/RX logging =====
#include "RemoteLogger.h"

// ================= DHT22 ====================
DHTSensor dhtSensor(26, DHT22);
BoxIDManager box;

// ================= GAS SENSOR (Serial2) =====
GasSensor gasSensor(&Serial2, GAS_RX_PIN, GAS_TX_PIN);

// ================== STATE ==================
const int STATE_SAFE    = 0;
const int STATE_WARNING = 1; // ALERT
const int STATE_DANGER  = 2; // DANGEROUS

// ================= TIMING ===================
float lastT = NAN, lastH = NAN;
unsigned long lastDhtMs = 0;
const unsigned long DHT_PERIOD_MS = 2000;

float lastGasValue = 0.0f;

unsigned long lastSendMs = 0;
const unsigned long SEND_PERIOD_MS = 10000;

unsigned long lastWifiCheckMs = 0;
const unsigned long WIFI_CHECK_MS = 1000;

// Threshold refresh every 5 minutes
unsigned long lastThreshFetchMs = 0;
const unsigned long THRESH_FETCH_PERIOD_MS = 5UL * 60UL * 1000UL;

// ===== WiFiManager =====
WiFiManager wm;

// ================== DEBUG (thresholds) ==================
#define DEBUG_THRESH 1
static bool threshEverPrinted = false;
static float prevPrintedAlert = NAN;
static float prevPrintedDanger = NAN;
static bool prevPrintedReady = false;
static unsigned long lastThreshDebugMs = 0;
const unsigned long THRESH_DEBUG_MIN_INTERVAL_MS = 2000;

// ================== system state ==================
int sysState = STATE_SAFE;

// ================= WiFi blue override =================
bool wifiWasConnected = false;
unsigned long wifiBlueUntilMs = 0;

// ================== NTP ==================
bool ntpStarted = false;

void startNTPMalaysia() {
  if (ntpStarted) return;
  configTime(8 * 3600, 0, "pool.ntp.org", "time.nist.gov", "time.google.com");
  ntpStarted = true;
  Serial.println("NTP configured (UTC+8 Malaysia). Waiting time sync...");
}

// ISO time string: 2026-02-07T17:18:19+08:00
String isoNowMY() {
  struct tm tmNow;
  if (!getLocalTime(&tmNow, 1500)) return "";
  char buf[32];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", &tmNow);
  return String(buf) + "+08:00";
}

// ================== Colors & State Helpers ==================
uint16_t getStateColor(int st) {
  if (st == STATE_SAFE) return 0x07E0; // C_GREEN
  if (st == STATE_WARNING) return 0x07FF; // C_YELLOW
  return 0xF800; // C_RED
}

const char* getStateText(int st) {
  if (st == STATE_SAFE) return "SAFE";
  if (st == STATE_WARNING) return "WARNING";
  return "DANGER";
}

// ================== BOOT SEQUENCE ==================
bool bootMode = true;
unsigned long bootStartTime = 0;
const unsigned long BOOT_DURATION_MS = 4500UL; // Total boot animation duration

// ================== NON-BLOCKING WiFiManager ==================
void startWiFiNonBlockingAlways(const String& apName) {
  wm.setConfigPortalBlocking(false);
  wm.setConnectTimeout(15);
  wm.setConfigPortalTimeout(0);
  wm.setWiFiAutoReconnect(true);
  wm.autoConnect(apName.c_str());
}

// ================== DEBUG THRESHOLDS (uses extern globals from SupabaseService) ==================
void debugThresholdChangeIfAny(bool force = false) {
#if DEBUG_THRESH
  unsigned long now = millis();
  if (!force && (now - lastThreshDebugMs) < THRESH_DEBUG_MIN_INTERVAL_MS) return;

  bool changed =
    force ||
    (!threshEverPrinted) ||
    (prevPrintedReady != thresholdsReady) ||
    (isnan(prevPrintedAlert) != isnan(THRESH_ALERT)) ||
    (isnan(prevPrintedDanger) != isnan(THRESH_DANGER)) ||
    (!isnan(THRESH_ALERT) && (fabsf(prevPrintedAlert - THRESH_ALERT) > 0.0001f)) ||
    (!isnan(THRESH_DANGER) && (fabsf(prevPrintedDanger - THRESH_DANGER) > 0.0001f));

  if (!changed) return;

  lastThreshDebugMs = now;
  threshEverPrinted = true;

  Serial.println();
  Serial.println("=== THRESHOLDS (current) ===");
  Serial.print("thresholdsReady: "); Serial.println(thresholdsReady ? "true" : "false");
  Serial.print("treshold_alert: ");  Serial.println(THRESH_ALERT, 4);
  Serial.print("treshold_dangerous: "); Serial.println(THRESH_DANGER, 4);
  Serial.println("============================");

  prevPrintedAlert = THRESH_ALERT;
  prevPrintedDanger = THRESH_DANGER;
  prevPrintedReady = thresholdsReady;
#endif
}

// ================== setup / loop ==================
void setup() {
  Serial.begin(115200);
  delay(100);
  box.begin();
  
  // Initialize remote logger (sends gas sensor logs to Supabase)
  initRemoteLogger();

  Serial.println("SENTINEL BOX_ID: " + box.get());
  pinMode(WIFI_RESET_PIN, INPUT_PULLUP);

  // Initialize audio/visual modules
  rgbLed.begin();
  buzzer.begin();
  rgbLed.set(0, 0, 0);

  // Initialize TFT via new module
  tftDisplay.begin();
  
  // Set box ID for display (FIXES BoxIDManager dependency)
  tftDisplay.setBoxId(box.get());
// In setup(), after rgbLed.begin():
rgbLed.set(255, 0, 0); delay(1000); // RED
rgbLed.set(0, 255, 0); delay(1000); // GREEN
rgbLed.set(0, 0, 255); delay(1000); // BLUE
  // Initialize DHT sensor via new module
  dhtSensor.begin();

  // Initialize gas sensor
  if (!gasSensor.begin()) {
    Serial.println("[GasSensor] Init failed!");
  }

  randomSeed(esp_random());

  // short startup beep sequence with visual flair
  buzzer.startBeep(1200, 60); delay(80);
  buzzer.startBeep(2000, 60); delay(80);

  // Start WiFiManager non-blocking and keep it running always
  startWiFiNonBlockingAlways(box.get());

  // Start enhanced boot sequence
  bootMode = true;
  bootStartTime = millis();
  tftDisplay.drawBootStatic();  // Starts logo spinner stage
  
  // Initial sensor readings for smoother transition
  dhtSensor.update();
  lastT = dhtSensor.getLastTemperature();
  lastH = dhtSensor.getLastHumidity();
  lastGasValue = 0.0f;
}

void loop() {
  // Critical: update hardware modules first
  rgbLed.update();
  buzzer.update();

  unsigned long now = millis();

  // Heap watchdog: SSL fragmentation builds up over hours — restart before it breaks
  if (ESP.getFreeHeap() < 30000) {
    Serial.printf("[WATCHDOG] Free heap critical (%u bytes), restarting...\n", ESP.getFreeHeap());
    delay(200);
    ESP.restart();
  }

  wm.process();
  handleWiFiResetButton();   // manual reset only (BOOT long-press)

  // ===== BOOT MODE: Enhanced multi-stage animation =====
  if (bootMode) {
    // Animate current boot stage (logo → initializing → diagnostics)
    tftDisplay.bootTick();

    // Transition to main UI after boot animation completes (4.5 seconds)
    if (now - bootStartTime >= BOOT_DURATION_MS) {
      bootMode = false;
      
      // Build main UI
      tftDisplay.buildUI();
      
      // Initial UI updates
      tftDisplay.updateHeaderWiFi(true);
      
      sysState = (lastGasValue >= THRESH_DANGER) ? STATE_DANGER :
                 (lastGasValue >= THRESH_ALERT)  ? STATE_WARNING : STATE_SAFE;
                 
      tftDisplay.updateStatusPanel(sysState, true);
      tftDisplay.updateTempHumPanels(true);
      tftDisplay.updateGasPanel(lastGasValue, true);

      // Run sensor module diagnostic (logs to Supabase via RemoteLogger)
      gasSensor.printModuleInfo();

      // Initialize cloud services if WiFi available
      if (WiFi.status() == WL_CONNECTED) {
        startNTPMalaysia();
        thresholdsReady = false;
        fetchThresholdsFromSupabase(box);  // <<<<< PASS BOX OBJECT
        lastThreshFetchMs = now;
        debugThresholdChangeIfAny(true);
      } else {
        thresholdsReady = false;
        lastThreshFetchMs = now;
        debugThresholdChangeIfAny(true);
      }

      wifiWasConnected = false;
      lastSendMs = now;
      
      // Play subtle transition sound
      buzzer.startBeep(1800, 40);
      delay(60);
      buzzer.startBeep(2200, 40);
    }

    delay(5);
    return;
  }

  // ===== OPERATIONAL MODE =====
  
  // Periodic WiFi check (WM keeps running)
  if (now - lastWifiCheckMs >= WIFI_CHECK_MS) {
    lastWifiCheckMs = now;
    if (WiFi.status() == WL_CONNECTED) startNTPMalaysia();
  }

  // Threshold refresh every 5 minutes when WiFi connected
  if (WiFi.status() == WL_CONNECTED) {
    if (!thresholdsReady || (now - lastThreshFetchMs >= THRESH_FETCH_PERIOD_MS)) {
      if (fetchThresholdsFromSupabase(box)) {  // <<<<< PASS BOX OBJECT
        lastThreshFetchMs = now;
      } else {
        lastThreshFetchMs = now; // Still retry later
      }
    }
  }

  // OTA check - FIXED: dereference pointer to get reference
  AZP_OTA_check(*tftDisplay.getTft());

  // DHT update - USE NEW MODULE
  if (now - lastDhtMs >= DHT_PERIOD_MS) {
    lastDhtMs = now;
    dhtSensor.update();
    lastT = dhtSensor.getLastTemperature();
    lastH = dhtSensor.getLastHumidity();
  }

  // Real gas sensor reading (non-blocking, handles own request timing)
  if (gasSensor.update()) {
    lastGasValue = gasSensor.readPPM();
    
    // Log gas sensor TX, RX, and PPM to Supabase
    String txHex = gasSensor.getLastTxHex();
    String rxHex = gasSensor.getLastRxHex();
    logGasTx(txHex);
    logGasRx(rxHex, lastGasValue);
    
    Serial.printf("[GasSensor] %.2f PPM | %s\n", lastGasValue, getStateText(sysState));
  }

  sysState = (lastGasValue >= THRESH_DANGER) ? STATE_DANGER :
             (lastGasValue >= THRESH_ALERT)  ? STATE_WARNING : STATE_SAFE;

  tftDisplay.updateHeaderWiFi(false);
  tftDisplay.updateStatusPanel(sysState, false);
  tftDisplay.updateTempHumPanels(false);
  tftDisplay.updateGasPanel(lastGasValue, false);

  // Update LED and buzzer based on state
  unsigned long now2 = millis();
  bool wifiConnected = (WiFi.status() == WL_CONNECTED);

  if (wifiConnected && !wifiWasConnected) wifiBlueUntilMs = now2 + 2000;
  wifiWasConnected = wifiConnected;

  if (!wifiConnected) {
    static int b = 0;
    static int dir = 1;
    b += dir * 4;
    if (b > 200) dir = -1;
    if (b < 40)  dir = 1;
    rgbLed.set((uint8_t)b, (uint8_t)(b / 2), 0);
  } else if ((long)(now2 - wifiBlueUntilMs) < 0) {
    rgbLed.set(0, 0, 180);
  } else {
    static int prevState = -1;
    static unsigned long lastWarnBeepMs = 0;
    static unsigned long lastDangerBeepMs = 0;
    const uint16_t BEEP_FREQ = 2500;
    const uint16_t BEEP_DUR_MS = 60;

    const uint8_t SAFE_BRIGHT = 255;   // Full brightness (0–255)
    const uint8_t SAFE_DIM    = 20;    // Dim level (e.g., 10% of bright)

 if (sysState == STATE_SAFE) {
    static unsigned long lastUpdate = 0;
    const unsigned long onDuration = 10000UL; // 10 seconds
    const unsigned long offDuration = 1000UL; // 1 second
    const unsigned long cycle = onDuration + offDuration; // total cycle time

    if (now2 - lastUpdate >= 50) { // update every 50ms (or adjust if needed)
        lastUpdate = now2;

        // Determine if LED should be ON or OFF
        unsigned long t = now2 % cycle;
        bool ledOn = (t < onDuration);

        rgbLed.set(0, ledOn ? 230 : 0, 0); // full green (230) or off
    }
}

else if (sysState == STATE_WARNING) {
    // Yellow: red + green
    uint8_t red = 200;   // tweak if too orange
    uint8_t green = 180; // tweak if too green
    rgbLed.set(red, green, 0); // Yellow steady
    if (prevState != STATE_WARNING) {
        lastWarnBeepMs = now2;
        buzzer.startBeep(1500, BEEP_DUR_MS);
    }
    if ((now2 - lastWarnBeepMs) >= 2000UL) {
        lastWarnBeepMs = now2;
        buzzer.startBeep(1500, BEEP_DUR_MS);
    }
} 
else { // STATE_DANGER
    bool onPhase = ((now2 / 500UL) % 2UL) == 0UL;
    rgbLed.set(onPhase ? 200 : 0, 0, 0); // Red flashing
    if (prevState != STATE_DANGER) {
        lastDangerBeepMs = now2;
        buzzer.startBeep(1800, 60);
    }
    if ((now2 - lastDangerBeepMs) >= 1000UL) {
        lastDangerBeepMs = now2;
        buzzer.startBeep(2500,60);
    }
}
prevState = sysState;

  }

  // Send every 10s
  if (now - lastSendMs >= SEND_PERIOD_MS) {
    lastSendMs = now;
    float tSend = isnan(lastT) ? 0.0f : lastT;
    float hSend = isnan(lastH) ? 0.0f : lastH;
    
    // <<<<< CRITICAL: Pass box object + ISO timestamp to new Supabase function
    String createdAt = isoNowMY();
    sendToSupabase(box, tSend, hSend, lastGasValue, createdAt);
  }

  //delay(1);
}