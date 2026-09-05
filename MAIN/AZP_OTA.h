#ifndef AZP_OTA_H
#define AZP_OTA_H

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include "Buzzer.h"  // Required to use the global 'buzzer' object

// =====================================================
// USER SETTINGS
// =====================================================
#define AZP_FW_VERSION      3.9f
#define AZP_OTA_INTERVAL    15000UL      // 15 seconds

// =====================================================
// OTA SERVER (CRITICAL: NO TRAILING SPACES!)
// NOTE: firmware hosting moved from the old external azmiproductions.com
// PHP host into the Sentinel app itself (Vercel Blob + a firmware_versions
// table). Only these two URLs changed - the version-check/update logic
// below is untouched.
// =====================================================
static const char* AZP_VERSION_URL = "https://sentinel.example.com/api/firmware/version";
static const char* AZP_BIN_URL     = "https://sentinel.example.com/api/firmware/download";

// =====================================================
// INTERNAL TIMER
// =====================================================
static unsigned long _azpLastCheck = 0;
static bool AZP_OTA_ACTIVE = false;

// =====================================================
// BLOCKING BEEP HELPER (works with existing Buzzer class)
// Uses public interface + manual update polling
// =====================================================
static void blockingBeep(uint16_t freq, uint16_t durMs) {
    buzzer.startBeep(freq, durMs);  // Start non-blocking beep
    unsigned long start = millis();
    // Poll update() until duration expires
    while (millis() - start < durMs) {
        buzzer.update();  // Critical: checks if beep should stop
        delay(1);         // Small yield to avoid CPU hogging
    }
    buzzer.update(); // Final safety call to ensure off
}

// =====================================================
// MODERN OTA SCREEN (NO LOADING BAR)
// =====================================================
inline void AZP_showUpdatingScreen(Adafruit_ST7735 &tft)
{
    int16_t W = tft.width();
    int16_t H = tft.height();

    tft.fillScreen(ST77XX_BLACK);

    tft.drawFastHLine(0, 0, W, ST77XX_CYAN);
    tft.drawFastHLine(0, H - 1, W, ST77XX_CYAN);

    // --- FIRMWARE ---
    tft.setTextSize(2);
    tft.setTextColor(ST77XX_WHITE);
    int16_t fwX = (W - (8 * 12)) / 2;
    if (fwX < 0) fwX = 0;
    tft.setCursor(fwX, 30);
    tft.print("FIRMWARE");

    // --- UPDATE ---
    int16_t upX = (W - (6 * 12)) / 2;
    if (upX < 0) upX = 0;
    tft.setCursor(upX, 55);
    tft.print("UPDATE");

    // orange line separator
    tft.drawFastHLine(20, 80, W - 40, ST77XX_ORANGE);

    // --- DO NOT POWER OFF ---
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    const char* msg = "Do not power off";
    int16_t msgWidth = strlen(msg) * 6; // 6 pixels per char at text size 1
    int16_t msgX = (W - msgWidth) / 2;
    tft.setCursor(msgX, 95);
    tft.print(msg);
}

// =====================================================
// OTA CHECK FUNCTION — USES BLOCKING BEEPS
// CALL: AZP_OTA_check(tft);
// =====================================================
inline void AZP_OTA_check(Adafruit_ST7735 &tft)
{
    // Respect check interval
    if (_azpLastCheck && millis() - _azpLastCheck < AZP_OTA_INTERVAL) return;
    _azpLastCheck = millis();

    if (WiFi.status() != WL_CONNECTED) return;

    WiFiClientSecure client;
    client.setInsecure(); // Accept any server certificate (use cautiously)

    HTTPClient http;
    if (!http.begin(client, AZP_VERSION_URL)) return;

    int httpCode = http.GET();
    if (httpCode != HTTP_CODE_OK) {
        http.end();
        return;
    }

    String payload = http.getString();
    http.end();
    payload.trim();

    float serverVersion = payload.toFloat();
    float currentVersion = AZP_FW_VERSION;

    // Compare versions using integer math to avoid float precision issues
    if ((int)(serverVersion * 100 + 0.5) > (int)(currentVersion * 100 + 0.5)) {

        Serial.println("[AZP-OTA] New firmware detected. Updating...");

        AZP_OTA_ACTIVE = true;

        // 🔊 Enhanced beep pattern: double-beep → 3s silence → double-beep
        blockingBeep(2500, 120);
        delay(80);
        blockingBeep(2000, 120);
        delay(3000);

        blockingBeep(2500, 120);
        delay(80);
        blockingBeep(2000, 120);

        // Show updating screen
        AZP_showUpdatingScreen(tft);

        delay(500); // Brief pause before update

        // Perform OTA update
        t_httpUpdate_return ret = httpUpdate.update(client, AZP_BIN_URL);

        switch (ret) {
            case HTTP_UPDATE_FAILED:
                Serial.printf("[AZP-OTA] Update failed: %s\n",
                              httpUpdate.getLastErrorString().c_str());
                AZP_OTA_ACTIVE = false;
                break;

            case HTTP_UPDATE_NO_UPDATES:
                AZP_OTA_ACTIVE = false;
                break;

            case HTTP_UPDATE_OK:
                Serial.println("[AZP-OTA] Update success. Rebooting...");
                // Device will restart automatically after successful update
                break;
        }
    }
}

#endif