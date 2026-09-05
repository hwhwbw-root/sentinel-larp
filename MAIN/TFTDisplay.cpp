#include "TFTDisplay.h"
#include "Logo.h"  // <<<<< MUST EXIST WITH YOUR LOGO
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <WiFi.h>
#include <math.h>

// TFT PINS (hardcoded for this module)
#define TFT_CS   15
#define TFT_DC   2
#define TFT_RST  4
#define TFT_SCLK 18
#define TFT_MOSI 19

// Colors (ST7735 5-6-5 format)
const uint16_t C_BLACK     = 0x0000;
const uint16_t C_WHITE     = 0xFFFF;
const uint16_t C_CYAN      = 0xFFE0;   // Correct ST7735 cyan
const uint16_t C_BLUE      = 0x001F;   // Correct ST7735 blue
const uint16_t C_GREEN     = 0x07E0;
const uint16_t C_YELLOW    = 0xFFE0;
const uint16_t C_RED       = 0xF800;   // Correct ST7735 red
const uint16_t C_DARK_GRAY = 0x7BEF;
const uint16_t C_PURPLE    = 0xF81F;
const uint16_t C_ORANGE    = 0xFDA0;

// Forward declarations for color/text helpers
extern uint16_t getStateColor(int st);
extern const char* getStateText(int st);
extern float lastT, lastH;
extern float THRESH_ALERT, THRESH_DANGER;

// Instantiate global object
TFTDisplay tftDisplay;

// Constructor - initialize all members
TFTDisplay::TFTDisplay()
    : tft(TFT_CS, TFT_DC, TFT_MOSI, TFT_SCLK, TFT_RST),
      W(0), H(0), M(0), G(0), HEADER_H(0),
      STATUS_Y(0), STATUS_H(0), TH_Y(0), TH_H(0),
      GAS_Y(0), GAS_H(0), GAS_BAR_Y(0), GAS_BAR_H(0),
      uiBuilt(false), uiState(-1), uiT(NAN), uiH(NAN),
      uiGasValue(NAN), uiWifi(-999),
      currentBoxId("SENTINEL"),
      bootStage(BOOT_LOGO_SPINNER),
      bootStageStartMs(0),
      lastBootAnimMs(0),
      bootSpinnerStep(0),
      bootDotFrame(0)
{
}

void TFTDisplay::begin() {
    tft.initR(INITR_REDTAB);
    tft.setRotation(1);
    computeLayout();
    clearScreen();
}

void TFTDisplay::clearScreen() {
    tft.fillScreen(C_BLACK);
}

void TFTDisplay::computeLayout() {
    W = tft.width();
    H = tft.height();

    // Compute layout parameters dynamically
    HEADER_H = 20;
    G = 4;
    M = 6;
    STATUS_H = 22;
    TH_H     = 34;
    GAS_H    = 38;
    GAS_BAR_H = 8;

    STATUS_Y = HEADER_H + G;
    TH_Y     = STATUS_Y + STATUS_H + G;
    GAS_Y    = TH_Y + TH_H + G;

    int16_t bottom = GAS_Y + GAS_H;
    if (bottom > H - M) {
        int16_t overflow = bottom - (H - M);
        GAS_H -= overflow;
        if (GAS_H < 28) GAS_H = 28;
    }

    GAS_BAR_Y = GAS_Y + 24;
    if (GAS_BAR_Y + GAS_BAR_H > GAS_Y + GAS_H - 2) {
        GAS_BAR_Y = (GAS_Y + GAS_H - 2) - GAS_BAR_H;
    }
}

// ==================== BOOT SEQUENCE ====================

void TFTDisplay::drawBootStatic() {
    computeLayout();
    clearScreen();
    
    bootStage = BOOT_LOGO_SPINNER;
    bootStageStartMs = millis();
    bootSpinnerStep = 0;
    bootDotFrame = 0;
    lastBootAnimMs = millis();
    
    drawLogoScreen();
}

void TFTDisplay::drawLogoScreen() {
    // Center logo
    int logoX = (W - LOGO_WIDTH) / 2;
    int logoY = (H / 2) - (LOGO_HEIGHT / 2) - 10; // Slightly above center

    // Draw logo
    tft.drawRGBBitmap(logoX, logoY, sentinel_logo, LOGO_WIDTH, LOGO_HEIGHT);
}

void TFTDisplay::animateSpinner() {
    unsigned long now = millis();
    if (now - lastBootAnimMs < 70) return; // ~14 FPS
    lastBootAnimMs = now;

    // Position spinner BELOW logo
    int logoX = (W - LOGO_WIDTH) / 2;
    int logoY = (H / 2) - (LOGO_HEIGHT / 2) - 10;
    int spinnerY = logoY + LOGO_HEIGHT + 16; // 16px gap
    int cx = W / 2; // Center horizontally
    int cy = spinnerY;
    int radius = 10;

    // Clear previous dot
    float prevAngle = ((bootSpinnerStep - 1 + 12) % 12) * (2.0f * PI) / 12.0f;
    int pxPrev = cx + (int)(cosf(prevAngle) * radius);
    int pyPrev = cy + (int)(sinf(prevAngle) * radius);
    tft.drawPixel(pxPrev, pyPrev, C_BLACK);
    tft.drawPixel(pxPrev + 1, pyPrev, C_BLACK);
    tft.drawPixel(pxPrev, pyPrev + 1, C_BLACK);
    tft.drawPixel(pxPrev - 1, pyPrev, C_BLACK);
    tft.drawPixel(pxPrev, pyPrev - 1, C_BLACK);

    // Draw new dot with CYAN color
    float angle = (bootSpinnerStep * (2.0f * PI)) / 12.0f;
    int px = cx + (int)(cosf(angle) * radius);
    int py = cy + (int)(sinf(angle) * radius);

    tft.fillCircle(px, py, 3, C_CYAN); // <-- Use your CYAN constant

    bootSpinnerStep = (bootSpinnerStep + 1) % 12;
}


void TFTDisplay::drawInitializingScreen() {
    clearScreen();
    
    // Main text - centered manually without textWidth()
    tft.setTextSize(2);
    tft.setTextColor(C_CYAN);
    tft.setCursor((W - 96) / 2, H/2 - 20); // "SENTINEL" ~96px at size 2
    tft.print("SENTINEL");
    
    tft.setTextSize(1);
    tft.setTextColor(C_WHITE);
    tft.setCursor((W - 110) / 2, H/2 + 4); // "Initializing System" ~110px at size 1
    tft.print("Initializing System");
}

void TFTDisplay::animateDots() {
    static const char* frames[] = {".  ", ".. ", "..."};
    unsigned long now = millis();
    
    // Change frame every 400ms
    if ((now - bootStageStartMs) % 400 < 80) {
        bootDotFrame = (bootDotFrame + 1) % 3;
    }
    
    int y = H/2 + 18;
    int textW = 18; // Approx width of "..." at size 1
    tft.fillRect((W - textW)/2 - 2, y - 2, textW + 4, 12, C_BLACK);
    
    tft.setTextSize(1);
    tft.setTextColor(C_WHITE);
    tft.setCursor((W - textW)/2, y);
    tft.print(frames[bootDotFrame]);
}

void TFTDisplay::drawDiagnosticsScreen() {
    clearScreen();
    
    // Header
    tft.setTextSize(2);
    tft.setTextColor(C_CYAN);
    tft.setCursor((W - 110) / 2, 10); // "SYSTEM READY" ~110px
    tft.print("SYSTEM READY");
    
    // Decorative dividers
    tft.drawFastHLine(10, 28, W-20, C_DARK_GRAY);
    
    // Diagnostic items with icons
    const char* items[] = {"Sensors", "WiFi", "Gas Mod", "Display"};
    uint16_t colors[] = {C_GREEN, C_YELLOW, C_ORANGE, C_PURPLE};
    
    for (int i = 0; i < 4; i++) {
        int y = 40 + i * 22;
        
        // Status dot
        tft.fillCircle(12, y + 8, 4, colors[i]);
        
        // Label
        tft.setTextSize(1);
        tft.setTextColor(C_WHITE);
        tft.setCursor(24, y);
        tft.print(items[i]);
        
        // Progress bar background
        tft.drawRect(W - 60, y + 3, 50, 8, C_DARK_GRAY);
    }
}

void TFTDisplay::animateDiagnosticValues() {
    unsigned long elapsed = millis() - bootStageStartMs;
    int progress = min(100, (int)(elapsed * 0.12f)); // Reach 100% in ~833ms
    
    // Animate each bar with staggered timing
    for (int i = 0; i < 4; i++) {
        int barProgress = min(100, progress - i * 15);
        if (barProgress <= 0) continue;
        
        int y = 40 + i * 22;
        int fill = (barProgress * 50) / 100;
        
        // Fill color based on item
        uint16_t fillColors[] = {C_GREEN, C_GREEN, C_ORANGE, C_PURPLE};
        
        // Clear previous fill
        tft.fillRect(W - 59, y + 4, 48, 6, C_BLACK);
        
        // Draw new fill
        if (fill > 0) {
            tft.fillRect(W - 59, y + 4, fill, 6, fillColors[i]);
        }
        
        // Show percentage when near complete
        if (barProgress > 85) {
            char buf[5];
            sprintf(buf, "%d%%", barProgress);
            tft.fillRect(W - 30, y - 2, 30, 10, C_BLACK);
            tft.setTextSize(1);
            tft.setTextColor(C_WHITE);
            tft.setCursor(W - 28, y - 2);
            tft.print(buf);
        }
    }
}

void TFTDisplay::bootTick() {
    unsigned long now = millis();
    
    switch (bootStage) {
        case BOOT_LOGO_SPINNER:
            animateSpinner();
            
            // Auto-advance after 2.2 seconds
            if (now - bootStageStartMs > 2200) {
                bootStage = BOOT_INITIALIZING;
                bootStageStartMs = now;
                bootDotFrame = 0;
                drawInitializingScreen();
            }
            break;
            
        case BOOT_INITIALIZING:
            animateDots();
            
            // Auto-advance after 1.8 seconds
            if (now - bootStageStartMs > 1800) {
                bootStage = BOOT_DIAGNOSTICS;
                bootStageStartMs = now;
                drawDiagnosticsScreen();
            }
            break;
            
        case BOOT_DIAGNOSTICS:
            animateDiagnosticValues();
            // Stay here until buildUI() is called externally
            break;
    }
}

// ==================== MAIN UI (after boot) ====================
void TFTDisplay::drawHeaderStatic() {
    tft.fillRect(0, 0, W, HEADER_H, C_BLACK);
    tft.drawFastHLine(0, HEADER_H, W, C_BLUE);

    tft.setTextSize(2);
    tft.setTextColor(C_CYAN);
    tft.setCursor(6, 2);
    tft.print("SENTINEL");

    tft.setTextSize(1);
    tft.setTextColor(C_WHITE);
    tft.setCursor(W - 52, 6);
    tft.print("WiFi:");
}

void TFTDisplay::drawPanelsStatic() {
    tft.drawRect(M, STATUS_Y, W - 2*M, STATUS_H, C_WHITE);
    tft.setTextSize(1);
    tft.setTextColor(C_CYAN);
    tft.setCursor(M + 4, STATUS_Y + 4);
    tft.print("STATUS");

    int16_t colW = (W - 2*M - G) / 2;
    int16_t x1 = M;
    int16_t x2 = M + colW + G;

    tft.drawRect(x1, TH_Y, colW, TH_H, C_WHITE);
    tft.drawRect(x2, TH_Y, colW, TH_H, C_WHITE);

    tft.setTextColor(C_CYAN);
    tft.setCursor(x1 + 4, TH_Y + 4);
    tft.print("TEMPERATURE");
    tft.setCursor(x2 + 4, TH_Y + 4);
    tft.print("HUMIDITY");

    tft.drawRect(M, GAS_Y, W - 2*M, GAS_H, C_WHITE);
    tft.setTextColor(C_CYAN);
    tft.setCursor(M + 4, GAS_Y + 4);
    tft.print(currentBoxId.c_str());  // ← Uses locally stored box ID

    tft.drawRect(M + 4, GAS_BAR_Y, W - 2*M - 8, GAS_BAR_H, C_WHITE);
}

void TFTDisplay::setBoxId(const String& id) {
    currentBoxId = id;
}

void TFTDisplay::buildUI() {
    // Skip boot animation cleanup if already built
    if (uiBuilt) return;
    
    computeLayout();
    clearScreen();
    drawHeaderStatic();
    drawPanelsStatic();
    uiBuilt = true;

    uiState = -1;
    uiT = NAN;
    uiH = NAN;
    uiGasValue = NAN;
    uiWifi = -999;
}

void TFTDisplay::updateHeaderWiFi(bool force) {
    if (!uiBuilt) return;
    
    int w = WiFi.status();
    if (!force && w == uiWifi) return;

    tft.fillRect(W - 20, 6, 18, 10, C_BLACK);
    tft.setTextSize(1);

    if (w == WL_CONNECTED) {
        tft.setTextColor(C_GREEN);
        tft.setCursor(W - 20, 6);
        tft.print("ON");
    } else {
        tft.setTextColor(C_RED);
        tft.setCursor(W - 20, 6);
        tft.print("OFF");
    }
    uiWifi = w;
}

void TFTDisplay::updateStatusPanel(int st, bool force) {
    if (!uiBuilt) return;
    
    if (!force && st == uiState) return;

    tft.fillRect(70, STATUS_Y + 4, W - 78, STATUS_H - 8, C_BLACK);

    tft.setTextSize(2);
    tft.setTextColor(getStateColor(st));
    tft.setCursor(70, STATUS_Y + 4);
    tft.print(getStateText(st));

    uiState = st;
}

void TFTDisplay::updateTempHumPanels(bool force) {
    if (!uiBuilt) return;
    
    bool tempChanged = (isnan(uiT) != isnan(lastT)) || (!isnan(lastT) && fabsf(uiT - lastT) > 0.05f);
    bool humChanged  = (isnan(uiH) != isnan(lastH)) || (!isnan(lastH) && fabsf(uiH - lastH) > 0.05f);

    int16_t colW = (W - 2*M - G) / 2;
    int16_t x1 = M;
    int16_t x2 = M + colW + G;

    if (force || tempChanged) {
        tft.fillRect(x1 + 4, TH_Y + 16, colW - 8, 18, C_BLACK);

        tft.setTextSize(2);
        tft.setTextColor(C_WHITE);
        tft.setCursor(x1 + 4, TH_Y + 16);
        if (isnan(lastT)) tft.print("--.-");
        else tft.print(lastT, 1);

        tft.setTextSize(1);
        tft.setCursor(x1 + colW - 14, TH_Y + 22);
        tft.print("C");

        uiT = lastT;
    }

    if (force || humChanged) {
        tft.fillRect(x2 + 4, TH_Y + 16, colW - 8, 18, C_BLACK);

        tft.setTextSize(2);
        tft.setTextColor(C_WHITE);
        tft.setCursor(x2 + 4, TH_Y + 16);
        if (isnan(lastH)) tft.print("--.-");
        else tft.print(lastH, 1);

        tft.setTextSize(1);
        tft.setCursor(x2 + colW - 14, TH_Y + 22);
        tft.print("%");

        uiH = lastH;
    }
}

void TFTDisplay::updateGasPanel(float gasValue, bool force) {
    if (!uiBuilt) return;
    
    extern float THRESH_ALERT, THRESH_DANGER;

    bool gasChanged = (isnan(uiGasValue) != isnan(gasValue)) || (!isnan(gasValue) && fabsf(uiGasValue - gasValue) > 0.01f);
    if (!force && !gasChanged) return;

    tft.fillRect(M + 4, GAS_Y + 16, W - 2*M - 8, 10, C_BLACK);
    tft.setTextSize(1);
    tft.setTextColor(C_WHITE);
    tft.setCursor(M + 4, GAS_Y + 16);
    tft.print("gas value:");
    tft.print(gasValue, 2);

    int16_t barX = M + 5;
    int16_t barW = W - 2*M - 10;

    float maxVal = THRESH_DANGER + 3.0f;
    if (maxVal < 5.0f) maxVal = 5.0f;

    int fill = 0;
    if (gasValue <= 0) fill = 0;
    else if (gasValue >= maxVal) fill = barW;
    else fill = (int)((gasValue / maxVal) * barW);

    tft.fillRect(barX, GAS_BAR_Y + 1, barW, GAS_BAR_H - 2, C_BLACK);

    uint16_t barColor = C_GREEN;
    if (gasValue >= THRESH_DANGER) barColor = C_RED;
    else if (gasValue >= THRESH_ALERT) barColor = C_YELLOW;

    tft.fillRect(barX, GAS_BAR_Y + 1, fill, GAS_BAR_H - 2, barColor);

    uiGasValue = gasValue;
}