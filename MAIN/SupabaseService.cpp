#include "SupabaseService.h"
#include "BoxID.h"

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <math.h>

// Sentinel backend configuration (NO TRAILING SPACES!)
// NOTE: these two URLs used to point at a shared Supabase project with a
// single anon key baked into every device's firmware - that key was a real
// exposure (anyone could read/write the whole table with it). The new
// backend instead issues one API key per device (see SUPABASE_KEY below),
// so a leaked key only exposes that one box. Only these three values and
// the request-building lines that reference them changed here - the gas
// reading, threshold comparison, and JSON parsing logic below is untouched.
static const char* SUPABASE_ENV_URL =
  "https://sentinel.example.com/api/devices/ingest";

static const char* SUPABASE_DEV_URL =
  "https://sentinel.example.com/api/devices/thresholds";

// This device's Sentinel API key - issued once when the device is created
// in Device Management, shown only at creation time. Replace this
// placeholder with that key before flashing. Treat it like a password:
// do not commit a real key to source control.
static const char* SUPABASE_KEY =
  "REPLACE_WITH_THIS_DEVICES_SENTINEL_API_KEY";

// Global threshold variables (defined here once)
float THRESH_ALERT  = 1.00f;
float THRESH_DANGER = 2.00f;
bool thresholdsReady = false;

bool fetchThresholdsFromSupabase(BoxIDManager& box) {
  if (WiFi.status() != WL_CONNECTED) return false;

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;

  String url = String(SUPABASE_DEV_URL)
    + "?box_id=eq." + box.get()
    + "&select=treshold_alert,treshold_dangerous"
    + "&limit=1";

  if (!http.begin(client, url)) {
    Serial.println("Threshold fetch: http.begin failed");
    return false;
  }

  http.setTimeout(15000);
  http.addHeader("apikey", SUPABASE_KEY);
  http.addHeader("Authorization", "Bearer " + String(SUPABASE_KEY));

  int code = http.GET();
  String resp = http.getString();
  http.end();
  client.stop();

#if 1 // Keep debug prints; remove #if if always wanted
  Serial.println();
  Serial.println("---- Threshold GET DEBUG ----");
  Serial.print("URL: "); Serial.println(url);
  Serial.print("HTTP code: "); Serial.println(code);
  Serial.println("Response:");
  Serial.println(resp);
  Serial.println("-----------------------------");
#endif

  if (code != 200) return false;

  // Parse JSON manually (assumes valid array with one object)
  int aPos = resp.indexOf("\"treshold_alert\"");
  int dPos = resp.indexOf("\"treshold_dangerous\"");

  if (aPos < 0 || dPos < 0) return false;

  // Find value after colon
  int aColon = resp.indexOf(':', aPos);
  int aEnd = resp.indexOf(',', aColon);
  if (aEnd < 0) aEnd = resp.indexOf('}', aColon);

  int dColon = resp.indexOf(':', dPos);
  int dEnd = resp.indexOf('}', dColon);
  int dComma = resp.indexOf(',', dColon);
  if (dComma > 0 && dComma < dEnd) dEnd = dComma;

  if (aColon < 0 || dColon < 0) return false;

  String aVal = resp.substring(aColon + 1, aEnd); aVal.trim();
  String dVal = resp.substring(dColon + 1, dEnd); dVal.trim();

  // Handle possible nulls or non-numeric
  if (aVal == "null" || dVal == "null") return false;

  float a = aVal.toFloat();
  float d = dVal.toFloat();

  if (a <= 0.0f || d <= 0.0f || d <= a) return false;

  THRESH_ALERT = a;
  THRESH_DANGER = d;
  thresholdsReady = true;

  Serial.printf("✓ Thresholds updated: alert=%.2f danger=%.2f\n", THRESH_ALERT, THRESH_DANGER);
  return true;
}

void sendToSupabase(BoxIDManager& box,
                    float tC,
                    float hPct,
                    float gasValue,
                    const String& createdAt) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;

  if (!http.begin(client, SUPABASE_ENV_URL)) {
    Serial.println("HTTP begin() failed");
    return;
  }

  http.setTimeout(15000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_KEY);
  http.addHeader("Authorization", "Bearer " + String(SUPABASE_KEY));
  http.addHeader("Prefer", "return=minimal");

  int alertValue =
    (gasValue >= THRESH_DANGER) ? 2 :
    (gasValue >= THRESH_ALERT)  ? 1 : 0;

  char body[320];
  if (createdAt.length() > 0) {
    snprintf(body, sizeof(body),
      "{\"box_id\":\"%s\",\"gas_value\":%.2f,\"temperature\":%.2f,\"humidity\":%.2f,\"alert\":%d,\"created_at\":\"%s\"}",
      box.get().c_str(), gasValue, tC, hPct, alertValue, createdAt.c_str());
  } else {
    snprintf(body, sizeof(body),
      "{\"box_id\":\"%s\",\"gas_value\":%.2f,\"temperature\":%.2f,\"humidity\":%.2f,\"alert\":%d}",
      box.get().c_str(), gasValue, tC, hPct, alertValue);
  }

  int code = http.POST((uint8_t*)body, strlen(body));
  Serial.printf("Supabase POST -> %d\n", code);

  http.end();
  client.stop();
}