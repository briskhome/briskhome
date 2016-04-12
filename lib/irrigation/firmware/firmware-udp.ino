/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ firmware/firmware-udp.ino
 *
 * UDP-based irrigation controller for Arduino UNO.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

#include <SPI.h>
#include <Ethernet2.h>
#include <EthernetUdp2.h>

#define UDP_TX_PACKET_MAX_SIZE 256

#define GRNH_VALVE     4  // Relay pin for drop watering valve
#define GRNH_SOIL_HUM  1
#define GRNH_AIR_HUM   0
#define GRNH_AIR_TEMP  0
#define GRDN_VALVE     5  // Relay pin for garden watering valve.
#define GRDN_SOIL_HUM  0
#define WATER_TEMP     0
#define RELAY_THREE    6
#define RELAY_FOUR     7

char inBuffer[UDP_TX_PACKET_MAX_SIZE];
unsigned int localPort = 8888;
byte mac[] = { 0x62, 0x69, 0x63, 0x74, 0x72, 0x6C };
IPAddress ip(192, 168, 0, 99);
EthernetUDP Udp;

void setup() {
  Ethernet.begin(mac, ip);
  Udp.begin(localPort);

  pinMode(GRNH_VALVE, OUTPUT);
  pinMode(GRDN_VALVE, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Udp.read(inBuffer, UDP_TX_PACKET_MAX_SIZE);
    String request = String(inBuffer);
    Serial.println(request);
    String command = request.substring(request.length() - 3);
    int number = command.substring(0, 2).toInt();
    int status = command.substring(2).toInt();
    String response;
    if (number == GRNH_VALVE || number == GRDN_VALVE || number == RELAY_THREE || number == RELAY_FOUR) {
      digitalWrite(number, status);
      response = "{ \"status\": { \"code\": 200, \"message\": \"OK\" } }";
    } else {
      String greenhouseValve = String(digitalRead(GRNH_VALVE));
      String greenhouseSoilHumidity = String(analogRead(GRNH_SOIL_HUM));
      String greenhouseAirHumidity = String(analogRead(GRNH_AIR_HUM));
      String greenhouseAirTemperature = String(analogRead(GRNH_AIR_TEMP));
      String gardenValve = String(digitalRead(GRDN_VALVE));
      String gardenSoilHumidity = String(analogRead(GRDN_SOIL_HUM));
      String waterTemperature = String(analogRead(WATER_TEMP));
      response = "{ \"status\": { \"code\": 200, \"message\": \"OK\" }, \"data\": { \"request\": " + request + ", \"sensors\": { \"GRNH_VALVE\": " + greenhouseValve + ", \"GRNH_SOIL_HUM\": " + greenhouseSoilHumidity + ", \"GRNH_AIR_HUM\": " + greenhouseAirHumidity + ", \"GRNH_AIR_TEMP\": " + greenhouseAirTemperature + ", \"GRDN_VALVE\": " + gardenValve + ", \"GRDN_SOIL_HUM\": " + gardenSoilHumidity + ", \"WATER_TEMP\": " + waterTemperature + " } } }";
    }
    char outBuffer[UDP_TX_PACKET_MAX_SIZE];
    response.toCharArray(outBuffer, UDP_TX_PACKET_MAX_SIZE);
    Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
    Udp.write(outBuffer);
    Udp.endPacket();
    delay(10);
  }
}
