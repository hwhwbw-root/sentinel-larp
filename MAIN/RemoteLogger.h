#ifndef REMOTE_LOGGER_H
#define REMOTE_LOGGER_H

#include <Arduino.h>

// ============================================================================
// REMOTE LOGGER - Enable/Disable via compile flag
// ============================================================================
// To ENABLE logging:  #define ENABLE_REMOTE_LOGGING 1
// To DISABLE logging: #define ENABLE_REMOTE_LOGGING 0
// 
// When disabled, all log functions become no-ops (zero memory/CPU overhead)
// ============================================================================

#ifndef ENABLE_REMOTE_LOGGING
  #define ENABLE_REMOTE_LOGGING 1  // DEFAULT: DISABLED (change to 1 to enable)
#endif

// Initialize logger (call once in setup())
void initRemoteLogger();

// Send log to Supabase
void remoteLog(const String& level, const String& message);

// Convenience macros
#define RLOG_INFO(msg) remoteLog("INFO", msg)
#define RLOG_DEBUG(msg) remoteLog("DEBUG", msg)
#define RLOG_WARNING(msg) remoteLog("WARNING", msg)
#define RLOG_ERROR(msg) remoteLog("ERROR", msg)

// Gas sensor logging (TX, RX raw hex, and PPM)
void logGasTx(const String& hexData);
void logGasRx(const String& hexData, float ppm);
void logGasReading(float ppm);

#endif
