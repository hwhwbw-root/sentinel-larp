#ifndef TFTDISPLAY_H
#define TFTDISPLAY_H

#include <Adafruit_ST7735.h>
#include <Adafruit_GFX.h>
#include <Arduino.h>

// Forward declarations
class TFTDisplay;

extern uint16_t getStateColor(int st);
extern const char* getStateText(int st);

class TFTDisplay {
public:
    TFTDisplay();
    void begin();
    void clearScreen();
    void computeLayout();

    // Boot sequence
    void drawBootStatic();
    void bootTick();  // Unified tick handler for all boot stages
    
    // Main UI
    void buildUI();
    void setBoxId(const String& id);  // NEW: Set box ID from main sketch
    void updateHeaderWiFi(bool force = false);
    void updateStatusPanel(int st, bool force = false);
    void updateTempHumPanels(bool force = false);
    void updateGasPanel(float gasValue, bool force = false);
    
    // Required for OTA compatibility - returns pointer to internal TFT
    Adafruit_ST7735* getTft() { return &tft; }

private:
    Adafruit_ST7735 tft;

    // Layout dimensions
    int16_t W, H, M, G;
    int16_t HEADER_H;
    int16_t STATUS_Y, STATUS_H;
    int16_t TH_Y, TH_H;
    int16_t GAS_Y, GAS_H, GAS_BAR_Y, GAS_BAR_H;

    bool uiBuilt;
    int uiState;
    float uiT, uiH, uiGasValue;
    int uiWifi;
    String currentBoxId;  // Store box ID locally

    // Boot animation state
    enum BootStage {
        BOOT_LOGO_SPINNER,
        BOOT_INITIALIZING,
        BOOT_DIAGNOSTICS
    };
    
    BootStage bootStage;
    unsigned long bootStageStartMs;
    unsigned long lastBootAnimMs;
    uint8_t bootSpinnerStep;
    uint8_t bootDotFrame;

    // Boot animation helpers
    void drawLogoScreen();
    void drawInitializingScreen();
    void drawDiagnosticsScreen();
    void animateSpinner();
    void animateDots();
    void animateDiagnosticValues();
    
    // UI helpers (private since only called internally)
    void drawHeaderStatic();
    void drawPanelsStatic();
};

extern TFTDisplay tftDisplay;

#endif