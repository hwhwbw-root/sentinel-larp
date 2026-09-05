#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>
#include <HardwareSerial.h>

class GasSensor {
public:
  GasSensor(HardwareSerial* serial, uint8_t rxPin, uint8_t txPin);
  bool begin(unsigned long baud = 9600);
  float readPPM();          // Returns last valid reading (non-blocking)
  bool update();            // Call frequently to process sensor data
  void requestReading();    // Trigger new reading (auto-called by update())
  void printModuleInfo();   // Query and print sensor module info (type, range, units)
  void sendZeroCommand();   // Send zero-setting command to module
  
  // Get raw hex strings for logging
  String getLastTxHex();    // Returns last TX command as hex string
  String getLastRxHex();    // Returns last RX response as hex string

private:
  HardwareSerial* _serial;
  uint8_t _rxPin;
  uint8_t _txPin;
  float _lastPPM;
  unsigned long _lastRequestTime;
  
  // Store last TX/RX for logging
  uint8_t _lastTxBuffer[10];
  uint8_t _lastTxLen;
  uint8_t _lastRxBuffer[10];
  uint8_t _lastRxLen;

  static const unsigned long REQUEST_INTERVAL_MS = 5000;
  static const unsigned long BYTE_TIMEOUT_MS = 1000;
  static const int RESPONSE_LEN = 10;

  uint16_t modbusCRC(uint8_t* data, uint8_t len);
  bool parseResponse(uint8_t* buffer, int len, float& ppm);
  String bytesToHex(uint8_t* data, uint8_t len);
};

#endif
