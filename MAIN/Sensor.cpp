#include "Sensor.h"
#include "RemoteLogger.h"

GasSensor::GasSensor(HardwareSerial* serial, uint8_t rxPin, uint8_t txPin)
  : _serial(serial), _rxPin(rxPin), _txPin(txPin), _lastPPM(0.0f), _lastRequestTime(0),
    _lastTxLen(0), _lastRxLen(0) {}

uint16_t GasSensor::modbusCRC(uint8_t* data, uint8_t len) {
  uint16_t crc = 0xFFFF;
  for (int pos = 0; pos < len; pos++) {
    crc ^= (uint16_t)data[pos];
    for (int i = 0; i < 8; i++) {
      if (crc & 0x0001) {
        crc >>= 1;
        crc ^= 0xA001;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc;
}

String GasSensor::bytesToHex(uint8_t* data, uint8_t len) {
  String result = "";
  for (int i = 0; i < len; i++) {
    if (data[i] < 0x10) result += "0";
    result += String(data[i], HEX);
    if (i < len - 1) result += " ";
  }
  result.toUpperCase();
  return result;
}

bool GasSensor::begin(unsigned long baud) {
  _serial->begin(baud, SERIAL_8N1, _rxPin, _txPin);
  delay(100);
  while (_serial->available()) _serial->read(); // Clear buffer
  return true;
}

void GasSensor::requestReading() {
  static const uint8_t readCommand[] = {0xAA, 0x01, 0x01, 0xC1, 0xE0, 0xEE};
  if (millis() - _lastRequestTime > REQUEST_INTERVAL_MS) {
    // Store TX command for logging
    for (int i = 0; i < 6 && i < 10; i++) {
      _lastTxBuffer[i] = readCommand[i];
    }
    _lastTxLen = 6;
    
    _serial->write(readCommand, sizeof(readCommand));
    _serial->flush();
    _lastRequestTime = millis();
  }
}

String GasSensor::getLastTxHex() {
  return bytesToHex(_lastTxBuffer, _lastTxLen);
}

String GasSensor::getLastRxHex() {
  return bytesToHex(_lastRxBuffer, _lastRxLen);
}

bool GasSensor::parseResponse(uint8_t* buffer, int len, float& ppm) {
  // Store RX response for logging
  for (int i = 0; i < len && i < 10; i++) {
    _lastRxBuffer[i] = buffer[i];
  }
  _lastRxLen = len;
  
  if (len != RESPONSE_LEN) {
    return false;
  }

  if (buffer[0] != 0xAA) {
    return false;
  }

  if (buffer[9] != 0xEE) {
    return false;
  }

  bool neg = (buffer[3] & 0x80) != 0;
  uint16_t intPart = (buffer[4] << 8) | buffer[5];
  float frac = buffer[6] / 100.0f;
  ppm = intPart + frac;
  if (neg) ppm = -ppm;

  return true;
}

bool GasSensor::update() {
  static uint8_t buffer[RESPONSE_LEN];
  static int index = 0;
  static unsigned long lastByteTime = 0;

  // Timeout for incomplete packets
  if (index > 0 && millis() - lastByteTime > BYTE_TIMEOUT_MS) {
    index = 0;
  }

  // Request new reading periodically
  requestReading();

  // Process incoming bytes
  while (_serial->available()) {
    uint8_t b = _serial->read();
    lastByteTime = millis();

    // Sync to start byte (0xAA)
    if (index == 0 && b != 0xAA) {
      continue;
    }

    buffer[index++] = b;

    // Full packet received
    if (index == RESPONSE_LEN) {
      float ppm;
      if (parseResponse(buffer, RESPONSE_LEN, ppm)) {
        _lastPPM = ppm;
        index = 0;
        return true; // New valid reading available
      }
      index = 0; // Reset on invalid packet
    }
  }

  return false; // No new reading
}

float GasSensor::readPPM() {
  return _lastPPM;
}

void GasSensor::printModuleInfo() {
  // Command: AA 0F 01 C5 80 EE (Read Module Information)
  static const uint8_t infoCmd[] = {0xAA, 0x0F, 0x01, 0xC5, 0x80, 0xEE};

  // Clear any pending data
  while (_serial->available()) _serial->read();

  _serial->write(infoCmd, sizeof(infoCmd));
  _serial->flush();

  // Wait for response (16 bytes expected)
  uint8_t resp[16];
  int idx = 0;
  unsigned long start = millis();

  while (idx < 16 && millis() - start < 2000) {
    if (_serial->available()) {
      resp[idx++] = _serial->read();
    }
  }

  // Log raw response
  String hex = bytesToHex(resp, idx);
  Serial.println("[ModuleInfo] RX (" + String(idx) + " bytes): " + hex);

  if (idx < 16) {
    Serial.println("[ModuleInfo] Incomplete response");
    return;
  }

  // Parse per datasheet: AA 0F 01 [type] [rangeH][rangeL] [calH][calL] [alarmHH][alarmHL] [alarmLH][alarmLL] [unit] [crcH][crcL] EE
  uint8_t sensorType = resp[3];
  uint16_t range = (resp[4] << 8) | resp[5];
  uint16_t calGas = (resp[6] << 8) | resp[7];
  uint16_t alarmHigh = (resp[8] << 8) | resp[9];
  uint16_t alarmLow = (resp[10] << 8) | resp[11];
  uint8_t unitCode = resp[12];

  // Sensor type lookup
  const char* typeNames[] = {
    "??", "EX", "CO", "O2", "H2", "CH4", "C3H8", "CO2", "O3", "H2S",
    "SO2", "NH3", "CL2", "ETO", "HCL", "PH3", "HBr", "HCN", "AsH3", "HF",
    "Br2", "NO", "NO2", "NOX", "CLO2", "SiH4"
  };
  const char* typeName = (sensorType < 26) ? typeNames[sensorType] : "UNKNOWN";

  // Unit lookup
  const char* unitNames[] = {"%LEL", "%VOL", "PPM", "PPB", "N/A"};
  const char* unitName = (unitCode < 5) ? unitNames[unitCode] : "UNKNOWN";

  char info[256];
  snprintf(info, sizeof(info),
    "[ModuleInfo] Type: 0x%02X (%s) | Range: %u %s | CalGas: %u | AlarmHigh: %u | AlarmLow: %u | Unit: %s",
    sensorType, typeName, range, unitName, calGas, alarmHigh, alarmLow, unitName);
  Serial.println(info);
  RLOG_INFO(String("[ModuleInfo] Raw: ") + hex);
  RLOG_INFO(String(info));
}

void GasSensor::sendZeroCommand() {
  // Command: AA 02 01 C1 10 EE (Zero-setting)
  static const uint8_t zeroCmd[] = {0xAA, 0x02, 0x01, 0xC1, 0x10, 0xEE};

  while (_serial->available()) _serial->read();

  _serial->write(zeroCmd, sizeof(zeroCmd));
  _serial->flush();

  // Wait for response (7 bytes expected)
  uint8_t resp[7];
  int idx = 0;
  unsigned long start = millis();

  while (idx < 7 && millis() - start < 35000) {  // 30s calibration + margin
    if (_serial->available()) {
      resp[idx++] = _serial->read();
    }
  }

  String hex = bytesToHex(resp, idx);
  Serial.println("[ZeroSet] RX (" + String(idx) + " bytes): " + hex);

  if (idx >= 7 && resp[3] == 0x10) {
    Serial.println("[ZeroSet] SUCCESS");
    RLOG_INFO("[ZeroSet] SUCCESS");
  } else if (idx >= 7 && resp[3] == 0x20) {
    Serial.println("[ZeroSet] FAILED");
    RLOG_INFO("[ZeroSet] FAILED");
  } else {
    Serial.println("[ZeroSet] Unexpected response");
    RLOG_INFO(String("[ZeroSet] Unexpected: ") + hex);
  }
}
