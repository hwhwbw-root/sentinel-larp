// Pins.h
#ifndef PINS_H
#define PINS_H

// Buzzer
#define BUZZER_PIN      27
#define BUZZER_RES_BITS 8
#define BUZZER_DUTY_MAX 255

// RGB LED
#define LED_R           25
#define LED_G           32
#define LED_B           33
#define COMMON_ANODE    0  // 0 = common cathode, 1 = common anode

// DHT22
#define DHT_PIN         26

// Gas Sensor (Serial2)
#define GAS_RX_PIN      16
#define GAS_TX_PIN      17

// Other pins (if needed)
#define WIFI_RESET_PIN  0  // or whatever your reset pin is

#endif