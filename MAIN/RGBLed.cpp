#include "RGBLed.h"
#include "Pins.h"
#include <Arduino.h>
#include <math.h>

// Global instance definition
RGBLed rgbLed(LED_R, LED_G, LED_B, COMMON_ANODE);

RGBLed::RGBLed(uint8_t r, uint8_t g, uint8_t b, bool ca)
    : rPin(r), gPin(g), bPin(b), commonAnode(ca) {}

void RGBLed::begin() {
    // Simple pinMode setup - no LEDC needed
    pinMode(rPin, OUTPUT);
    pinMode(gPin, OUTPUT);
    pinMode(bPin, OUTPUT);
    
    // Initialize LED off
    apply(0, 0, 0);
}

void RGBLed::set(uint8_t r, uint8_t g, uint8_t b) {
    targetR = r;
    targetG = g;
    targetB = b;
    currentR = r;
    currentG = g;
    currentB = b;
    isFading = false;
    apply(currentR, currentG, currentB);
}

void RGBLed::fadeTo(uint8_t r, uint8_t g, uint8_t b, unsigned long durationMs) {
    if (durationMs == 0) {
        set(r, g, b);
        return;
    }
    
    if (isFading && targetR == r && targetG == g && targetB == b) return;
    
    targetR = r;
    targetG = g;
    targetB = b;
    fadeStartMs = millis();
    fadeDurationMs = durationMs;
    isFading = true;
}

void RGBLed::update() {
    if (!isFading) return;
    
    unsigned long elapsed = millis() - fadeStartMs;
    if (elapsed >= fadeDurationMs) {
        currentR = targetR;
        currentG = targetG;
        currentB = targetB;
        isFading = false;
    } else {
        float progress = (float)elapsed / (float)fadeDurationMs;
        float eased = progress * progress * (3.0f - 2.0f * progress); // smootherstep
        currentR = (uint8_t)(currentR + (targetR - currentR) * eased);
        currentG = (uint8_t)(currentG + (targetG - currentG) * eased);
        currentB = (uint8_t)(currentB + (targetB - currentB) * eased);
    }
    apply(currentR, currentG, currentB);
}

void RGBLed::apply(uint8_t r, uint8_t g, uint8_t b) {
    // Handle common anode inversion
    if (commonAnode) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
    }
    
    // Simple analogWrite - works on ESP32 without LEDC setup
    analogWrite(rPin, r);
    analogWrite(gPin, g);
    analogWrite(bPin, b);
}

// ===== BOOT ANIMATION STAGES =====

void RGBLed::bootLogoStage() {
    unsigned long phase = millis() % 2000;
    float brightness = 0.3f + 0.4f * sinf(phase * 2.0f * PI / 2000.0f);
    uint8_t val = (uint8_t)(brightness * 60);
    set(0, val, val);
}

void RGBLed::bootInitStage() {
    unsigned long phase = millis() % 3000;
    float brightness = 0.2f + 0.3f * sinf(phase * 2.0f * PI / 3000.0f);
    uint8_t val = (uint8_t)(brightness * 80);
    set(val, val, val);
}

void RGBLed::bootDiagStage() {
    unsigned long phase = millis() % 4000;
    float pos = phase / 4000.0f;
    
    uint8_t r = 0, g = 0, b = 0;
    if (pos < 0.25f) {
        r = (uint8_t)(255 * (pos * 4.0f));
        g = 80;
    } else if (pos < 0.5f) {
        r = 255;
        g = (uint8_t)(80 * (1.0f - (pos - 0.25f) * 4.0f));
        b = (uint8_t)(40 * (pos - 0.25f) * 4.0f);
    } else if (pos < 0.75f) {
        r = (uint8_t)(255 * (1.0f - (pos - 0.5f) * 4.0f));
        g = 0;
        b = (uint8_t)(80 * ((pos - 0.5f) * 4.0f));
    } else {
        r = 0;
        g = (uint8_t)(60 * ((pos - 0.75f) * 4.0f));
        b = 80;
    }
    set(r, g, b);
}