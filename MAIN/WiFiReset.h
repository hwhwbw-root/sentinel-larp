#pragma once
#include <WiFiManager.h>

// ================= WiFi RESET (BOOT button) ==================
// BOOT button on many ESP32 boards is GPIO0 (active LOW)
// Manual reset ONLY: hold BOOT for 3 seconds while running to clear saved WiFi credentials.
#define WIFI_RESET_PIN      0
#define WIFI_RESET_HOLD_MS  3000UL

static bool          wifiResetDone         = false;
static unsigned long wifiResetPressStartMs  = 0;

extern WiFiManager wm;

// ================== Manual WiFi reset helper (BOOT button) ==================
// This does NOT auto-reset. It only resets when you hold BOOT for 3 seconds while running.
void handleWiFiResetButton() {
  bool pressed = (digitalRead(WIFI_RESET_PIN) == LOW); // active LOW
  unsigned long now = millis();

  if (pressed) {
    if (wifiResetPressStartMs == 0) wifiResetPressStartMs = now;

    if (!wifiResetDone && (now - wifiResetPressStartMs >= WIFI_RESET_HOLD_MS)) {
      wifiResetDone = true;

      Serial.println("\n[WiFi] BOOT held 3s -> clearing WiFiManager saved credentials...");
      wm.resetSettings();

      delay(200);      // tiny pause to let flash write settle
      ESP.restart();   // reboot so WiFiManager starts fresh and AP portal appears
    }
  } else {
    wifiResetPressStartMs = 0;
    wifiResetDone = false; // allow future long-press actions
  }
}
