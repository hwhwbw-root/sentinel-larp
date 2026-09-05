// DHTSensor.cpp
#include "DHTSensor.h"

DHTSensor::DHTSensor(uint8_t pin, uint8_t type) : dht(pin, type) {}

void DHTSensor::begin() {
    dht.begin();
}

bool DHTSensor::update() {
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(t) || isnan(h)) {
        lastT = NAN;
        lastH = NAN;
        return false;
    }

    lastT = t;
    lastH = h;
    return true;
}

float DHTSensor::getLastTemperature() const {
    return lastT;
}

float DHTSensor::getLastHumidity() const {
    return lastH;
}