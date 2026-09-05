#ifndef RGBLED_H
#define RGBLED_H

#include <Arduino.h>

class RGBLed {
public:
    RGBLed(uint8_t rPin, uint8_t gPin, uint8_t bPin, bool commonAnode = true);
    
    void begin();
    void set(uint8_t r, uint8_t g, uint8_t b);
    void fadeTo(uint8_t r, uint8_t g, uint8_t b, unsigned long durationMs = 300);
    void update();
    
    // Boot animation helpers
    void bootLogoStage();
    void bootInitStage();
    void bootDiagStage();

private:
    const uint8_t rPin, gPin, bPin;
    const bool commonAnode;
    
    uint8_t currentR = 0, currentG = 0, currentB = 0;
    uint8_t targetR = 0, targetG = 0, targetB = 0;
    
    unsigned long fadeStartMs = 0;
    unsigned long fadeDurationMs = 0;
    bool isFading = false;
    
    void apply(uint8_t r, uint8_t g, uint8_t b);
};

extern RGBLed rgbLed;

#endif