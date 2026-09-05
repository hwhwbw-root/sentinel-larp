#ifndef SUPABASE_SERVICE_H
#define SUPABASE_SERVICE_H

#include <Arduino.h>

// Forward declaration
class BoxIDManager;

// Global threshold state (defined in .cpp)
extern float THRESH_ALERT;
extern float THRESH_DANGER;
extern bool thresholdsReady;

// Function declarations
bool fetchThresholdsFromSupabase(BoxIDManager& box);
void sendToSupabase(BoxIDManager& box,
                    float tC,
                    float hPct,
                    float gasValue,
                    const String& createdAt = "");

#endif