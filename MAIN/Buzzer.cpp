// Buzzer.cpp
#include "Buzzer.h"
#include "Pins.h"


Buzzer::Buzzer(uint8_t _pin) : pin(_pin) {}

void Buzzer::begin() {
    ledcAttach(pin, 2000, BUZZER_RES_BITS); // Default tone frequency
    buzzerOff();
}

void Buzzer::buzzerOn(uint16_t freq) {
    ledcWriteTone(pin, freq);
    ledcWrite(pin, BUZZER_DUTY_MAX);
}

void Buzzer::buzzerOff() {
    ledcWrite(pin, 0);
    ledcWriteTone(pin, 0);
}

void Buzzer::startBeep(uint16_t freq, uint16_t durMs) {
    if (beepingNow) return; // Prevent overlapping beeps
    buzzerOn(freq);
    beepingNow = true;
    beepStopAtMs = millis() + durMs;
}

void Buzzer::update() {
    if (beepingNow && (long)(millis() - beepStopAtMs) >= 0) {
        buzzerOff();
        beepingNow = false;
    }
}

// Global instance
Buzzer buzzer(BUZZER_PIN);