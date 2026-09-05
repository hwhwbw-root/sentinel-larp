// DHTSensor.h
#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include <Arduino.h>
#include <DHT.h>

class DHTSensor {
public:
    DHTSensor(uint8_t pin, uint8_t type);
    void begin();
    bool update();  // Returns true if valid readings obtained
    float getLastTemperature() const;
    float getLastHumidity() const;

private:
    DHT dht;
    float lastT = NAN;
    float lastH = NAN;
};

#endif