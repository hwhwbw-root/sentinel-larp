#ifndef BOX_ID_H
#define BOX_ID_H

#include <Preferences.h>
#include <Arduino.h>

class BoxIDManager {
private:
    Preferences prefs;
    String boxID;

    // Generate a short, sleek BOX_ID
    String generateBoxID() {
        const char* prefix = "SENTINEL";
        uint16_t rnd = esp_random() & 0xFFFF; // 16-bit random number
        char buf[5]; // 4 hex digits + null terminator
        snprintf(buf, sizeof(buf), "%04X", rnd);
        return String(prefix) + "-" + String(buf); // e.g., "SENTINEL-1A2B"
    }

public:
    BoxIDManager() : boxID("") {}

    void begin() {
        prefs.begin("SENTINEL", true); // read-only check
        boxID = prefs.getString("BOX_ID", "");
        prefs.end();

        if (boxID == "") {
            // No BOX_ID yet, create a new one
            prefs.begin("SENTINEL", false); // write mode
            boxID = generateBoxID();
            prefs.putString("BOX_ID", boxID);
            prefs.end();

            Serial.println("[BOX_ID] New BOX_ID generated and saved: " + boxID);
        } else {
            Serial.println("[BOX_ID] Existing BOX_ID loaded: " + boxID);
        }
    }

    String get() {
        return boxID;
    }

    const char* c_str() {
        return boxID.c_str();
    }

    // Optional: reset to generate a new ID
    void resetBoxID() {
        prefs.begin("SENTINEL", false);
        boxID = generateBoxID();
        prefs.putString("BOX_ID", boxID);
        prefs.end();
        Serial.println("[BOX_ID] BOX_ID reset: " + boxID);
    }
};

#endif
