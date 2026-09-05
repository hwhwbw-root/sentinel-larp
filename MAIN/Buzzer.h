// Buzzer.h
#ifndef BUZZER_H
#define BUZZER_H

#include <Arduino.h>

class Buzzer {
public:
    Buzzer(uint8_t pin);
    void begin();
    void startBeep(uint16_t freq, uint16_t durationMs);
    void update(); // Must be called in loop()

private:
    const uint8_t pin;
    unsigned long beepStopAtMs = 0;
    bool beepingNow = false;

    void buzzerOn(uint16_t freq);
    void buzzerOff();
};

extern Buzzer buzzer;

#endif