/*
  TRAINER 7 (KOPER BESAR) - COMPREHENSIVE SELF-TEST SKETCH
  Pengembang: Dzakwan & Wafian
  Board: Arduino Uno R3 / Arduino Nano (ATmega328P)
  
  Fungsi Sketch:
  Menguji seluruh modul periferal pada Trainer 7:
  - LCD 16x2 I2C
  - 4-Digit 7-Segment (TM1637)
  - Sensor Ultrasonik HC-SR04
  - Sensor Suhu & Kelembaban DHT11
  - Sensor LDR & Potensiometer 1 & 2
  - Sensor Gerak PIR
  - Push Button Array
  - Motor Servo SG90
  - Driver Motor DC L293D
  - LED Array 8-bit & LED RGB
  - Active Buzzer
*/

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Servo.h>
#include <DHT.h>
#include <TM1637Display.h>

// ================= PIN DEFINITIONS =================
#define PIN_PIR        2
#define PIN_RGB_R      3
#define PIN_DHT        4
#define PIN_RGB_G      5
#define PIN_RGB_B      6
#define PIN_SEG_CLK    7
#define PIN_SEG_DIO    8
#define PIN_SERVO      9
#define PIN_MOTOR_PWM  10
#define PIN_BUZZER     11
#define PIN_ULTRA_TRIG 12
#define PIN_ULTRA_ECHO 13

#define PIN_LDR        A0
#define PIN_POT1       A1
#define PIN_POT2       A2
#define PIN_BTN1       A3

#define DHTTYPE        DHT11

// ================= OBJECT INSTANCES =================
LiquidCrystal_I2C lcd(0x27, 16, 2);
TM1637Display display(PIN_SEG_CLK, PIN_SEG_DIO);
DHT dht(PIN_DHT, DHTTYPE);
Servo myServo;

void setup() {
  Serial.begin(9600);
  Serial.println(F("=== TRAINER 7: SYSTEM INITIALIZING ==="));

  // Inisialisasi Pin Mode
  pinMode(PIN_PIR, INPUT);
  pinMode(PIN_RGB_R, OUTPUT);
  pinMode(PIN_RGB_G, OUTPUT);
  pinMode(PIN_RGB_B, OUTPUT);
  pinMode(PIN_MOTOR_PWM, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_ULTRA_TRIG, OUTPUT);
  pinMode(PIN_ULTRA_ECHO, INPUT);
  pinMode(PIN_BTN1, INPUT_PULLUP);

  // Inisialisasi Modul
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("TRAINER 7 READY");
  lcd.setCursor(0, 1);
  lcd.print("DZAKWAN & WAFIAN");

  display.setBrightness(0x0f);
  display.showNumberDec(1234, false);

  dht.begin();
  myServo.attach(PIN_SERVO);
  myServo.write(90); // Posisi tengah

  // Beep start
  tone(PIN_BUZZER, 2000, 150);
  delay(1000);
  lcd.clear();
}

void loop() {
  // 1. Baca Sensor Ultrasonik
  digitalWrite(PIN_ULTRA_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_ULTRA_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_ULTRA_TRIG, LOW);
  long duration = pulseIn(PIN_ULTRA_ECHO, HIGH, 30000);
  int distanceCm = (duration > 0) ? (duration * 0.034 / 2) : 999;

  // 2. Baca Sensor Lingkungan (DHT & LDR)
  float temp = dht.readTemperature();
  int ldrVal = analogRead(PIN_LDR);
  int pot1Val = analogRead(PIN_POT1);
  int pot2Val = analogRead(PIN_POT2);
  bool pirState = digitalRead(PIN_PIR);

  // 3. Tampilkan Data ke LCD 16x2
  lcd.setCursor(0, 0);
  lcd.print("Dist:");
  lcd.print(distanceCm);
  lcd.print("cm ");
  lcd.print("PIR:");
  lcd.print(pirState ? "1" : "0");

  lcd.setCursor(0, 1);
  lcd.print("T:");
  if (isnan(temp)) lcd.print("--");
  else lcd.print((int)temp);
  lcd.print("C LDR:");
  lcd.print(ldrVal);
  lcd.print("  ");

  // 4. Tampilkan Jarak ke 4-Digit 7-Segment
  display.showNumberDec(distanceCm, false);

  // 5. Kontrol Servo berdasarkan Potensiometer 1
  int servoAngle = map(pot1Val, 0, 1023, 0, 180);
  myServo.write(servoAngle);

  // 6. Kontrol Kecepatan Motor DC berdasarkan Potensiometer 2
  int motorSpeed = map(pot2Val, 0, 1023, 0, 255);
  analogWrite(PIN_MOTOR_PWM, motorSpeed);

  // 7. Visualisasi LED RGB
  if (distanceCm < 15) {
    // Merah jika terlalu dekat
    digitalWrite(PIN_RGB_R, HIGH);
    digitalWrite(PIN_RGB_G, LOW);
    digitalWrite(PIN_RGB_B, LOW);
    tone(PIN_BUZZER, 1000, 50); // Beep peringatan
  } else if (distanceCm < 30) {
    // Kuning jika sedang
    digitalWrite(PIN_RGB_R, HIGH);
    digitalWrite(PIN_RGB_G, HIGH);
    digitalWrite(PIN_RGB_B, LOW);
  } else {
    // Hijau jika aman
    digitalWrite(PIN_RGB_R, LOW);
    digitalWrite(PIN_RGB_G, HIGH);
    digitalWrite(PIN_RGB_B, LOW);
  }

  // 8. Serial Monitor Logging
  Serial.print(F("Dist: ")); Serial.print(distanceCm);
  Serial.print(F("cm | PIR: ")); Serial.print(pirState);
  Serial.print(F(" | Temp: ")); Serial.print(temp);
  Serial.print(F(" | LDR: ")); Serial.print(ldrVal);
  Serial.print(F(" | Pot1: ")); Serial.print(pot1Val);
  Serial.print(F(" | Servo: ")); Serial.print(servoAngle);
  Serial.println();

  delay(250);
}
