/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ firmware/firmware-tcp.ino
 *
 * TCP-based irrigation controller for Arduino UNO.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

#include <SPI.h>
#include <Ethernet2.h>

#define GRNH_VALVE     4  // Relay pin for drop watering valve
#define GRNH_SOIL_HUM  1
#define GRNH_AIR_HUM   0
#define GRNH_AIR_TEMP  0
#define GRDN_VALVE     5  // Relay pin for garden watering valve.
#define GRDN_SOIL_HUM  0
#define WATER_TEMP     0
#define RELAY_THREE    6
#define RELAY_FOUR     7

byte mac[] = { 0x62, 0x69, 0x63, 0x74, 0x72, 0x6C };
IPAddress ip(10, 29, 0, 177);
EthernetServer server(80);

String readString;

void setup() {
  pinMode(GRNH_VALVE, OUTPUT);
  pinMode(GRDN_VALVE, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);

  Serial.begin(9600);
  Ethernet.begin(mac, ip);
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  EthernetClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        readString += c;
        Serial.print(c);

        if (c == '\n') {
          Serial.println(readString);

          String response;

          if (readString.indexOf("?name=GRNH_VALVE&action=open") > 0) {
            digitalWrite(GRNH_VALVE, HIGH);
            response = "{ \"status\": { \"code\": 200, \"message\": \"OK\" } }";
          } else if (readString.indexOf("?name=GRNH_VALVE&action=close") > 0) {
            digitalWrite(GRNH_VALVE, LOW);
            response = "{ \"status\": { \"code\": 200, \"message\": \"OK\" } }";
          } else if (readString.indexOf("?name=DROP_VALVE&action=open") > 0) {
            digitalWrite(GRDN_VALVE, HIGH);
            response = "{ \"status\": { \"code\": 200, \"message\": \"OK\" } }";
          } else if (readString.indexOf("?name=DROP_VALVE&action=close") > 0) {
            digitalWrite(GRDN_VALVE, LOW);
            response = "{ \"status\": { \"code\": 200, \"message\": \"OK\" } }";
          } else {
            String greenhouseValve = String(digitalRead(GRNH_VALVE));
            String greenhouseSoilHumidity = String(analogRead(GRNH_SOIL_HUM));
            String greenhouseAirHumidity = String(analogRead(GRNH_AIR_HUM));
            String greenhouseAirTemperature = String(analogRead(GRNH_AIR_TEMP));
            String gardenValve = String(digitalRead(GRDN_VALVE));
            String gardenSoilHumidity = String(analogRead(GRDN_SOIL_HUM));
            String waterTemperature = String(analogRead(WATER_TEMP));
            response = "{ \"status\": { \"code\": 200, \"message\": \"OK\" }, \"data\": { \"GRNH_VALVE\": " + greenhouseValve + ", \"GRNH_SOIL_HUM\": " + greenhouseSoilHumidity + ", \"GRNH_AIR_HUM\": " + greenhouseAirHumidity + ", \"GRNH_AIR_TEMP\": " + greenhouseAirTemperature + ", \"GRDN_VALVE\": " + gardenValve + ", \"GRDN_SOIL_HUM\": " + gardenSoilHumidity + ", \"WATER_TEMP\": " + waterTemperature + " } }";
          }
          client.println(response);
          delay(1);
          client.stop();

          readString = "";
        }
      }
    }
  }

  delay(10);
}
