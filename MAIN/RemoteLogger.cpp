#include "RemoteLogger.h"

#if ENABLE_REMOTE_LOGGING

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ============================================================================
// SENTINEL BACKEND CREDENTIALS (device diagnostic logs)
// ============================================================================
// NOTE: this used to be a second, entirely separate Supabase project with
// its own shared anon key - device_logs now lives in the same Sentinel
// backend as everything else. Only the URL and key values changed; the
// log formatting/rate-limiting below is untouched. Use this device's same
// Sentinel API key as in SupabaseService.cpp.
static const char* LOG_SUPABASE_URL =
  "https://sentinel.example.com/api/devices/logs";

static const char* LOG_SUPABASE_KEY =
  "REPLACE_WITH_THIS_DEVICES_SENTINEL_API_KEY";

// Rate limiting: max 1 log per 1 second (gas sensor updates ~every 2s)
static unsigned long lastLogTime = 0;
static const unsigned long LOG_RATE_LIMIT_MS = 1000;

// Get current timestamp (Malaysia timezone UTC+8)
String getTimestampMY() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo, 100)) {
    return "";
  }
  char buf[32];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S+08:00", &timeinfo);
  return String(buf);
}

// Internal send function
static void sendToSupabase(const String& level, const String& message) {
  // Rate limit check
  unsigned long now = millis();
  if (now - lastLogTime < LOG_RATE_LIMIT_MS) {
    return; // Skip - too soon
  }
  
  // WiFi check
  if (WiFi.status() != WL_CONNECTED) {
    return; // Silent fail when WiFi disconnected
  }
  
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  
  if (!http.begin(client, LOG_SUPABASE_URL)) {
    return;
  }
  
  http.setTimeout(10000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", LOG_SUPABASE_KEY);
  http.addHeader("Authorization", "Bearer " + String(LOG_SUPABASE_KEY));
  http.addHeader("Prefer", "return=minimal");
  
  // Build JSON body
  String timestamp = getTimestampMY();
  String boxId = "unknown";
  
  // Escape quotes in message
  String escapedMessage = message;
  escapedMessage.replace("\"", "\\\"");
  
  char body[512];
  snprintf(body, sizeof(body),
    "{\"level\":\"%s\",\"message\":\"%s\",\"timestamp\":\"%s\",\"box_id\":\"%s\"}",
    level.c_str(), escapedMessage.c_str(), timestamp.c_str(), boxId.c_str());
  
  int code = http.POST((uint8_t*)body, strlen(body));
  
  if (code == 201 || code == 204) {
    lastLogTime = now;
  }
  
  http.end();
  client.stop();
}

void initRemoteLogger() {
  // Nothing needed on init
}

void remoteLog(const String& level, const String& message) {
  sendToSupabase(level, message);
}

void logGasTx(const String& hexData) {
  char msg[128];
  snprintf(msg, sizeof(msg), "[GasSensor] TX: %s", hexData.c_str());
  sendToSupabase("DEBUG", msg);
}

void logGasRx(const String& hexData, float ppm) {
  char msg[128];
  snprintf(msg, sizeof(msg), "[GasSensor] RX: %s -> %.2f PPM", hexData.c_str(), ppm);
  sendToSupabase("DEBUG", msg);
}

void logGasReading(float ppm) {
  char msg[64];
  snprintf(msg, sizeof(msg), "[GasSensor] %.2f PPM", ppm);
  sendToSupabase("DEBUG", msg);
}

#else

// ============================================================================
// LOGGING DISABLED - All functions are no-ops (zero overhead)
// ============================================================================

void initRemoteLogger() {
  // Nothing - logging disabled
}

void remoteLog(const String& level, const String& message) {
  // Nothing - logging disabled
}

void logGasTx(const String& hexData) {
  // Nothing - logging disabled
}

void logGasRx(const String& hexData, float ppm) {
  // Nothing - logging disabled
}

void logGasReading(float ppm) {
  // Nothing - logging disabled
}

#endif
