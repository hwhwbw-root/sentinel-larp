#ifndef SUPABASE_SERVICE_H
#define SUPABASE_SERVICE_H

#include <Arduino.h>

// Set to 0 to build firmware that ignores dashboard demo commands entirely.
#define DEMO_COMMANDS 1

// Forward declaration
class BoxIDManager;

#if DEMO_COMMANDS
// Filled from the reply to each upload: a command queued by the dashboard
// ("warning", "danger", ...) and a faster upload period the server may request.
extern String demoCmd;
extern unsigned long demoPollMs;
#endif

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