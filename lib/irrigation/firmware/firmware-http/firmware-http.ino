#include <SPI.h>
#include <NewPing.h>
#include <OneWire.h>
#include <Ethernet2.h>
#include <TroykaDHT11.h>
#include <DallasTemperature.h>

#define TANK_VALVE        6
#define TANK_TRIGGER      1
#define TANK_ECHO         2
#define TANK_DISTANCE     500
#define TANK_TEMPERATURE  0

#define GRDN_VALVE        7
#define GRDN_MOISTURE     4 // A4

#define GRHS_VALVE        5
#define GRHS_MOISTURE     5 // A5
#define GRHS_DHT          3

#define MAX_DISTANCE      250
#define MIN_DISTANCE      50

byte    mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
String  request;

DHT11             dht(GRHS_DHT);
NewPing           sonar(TANK_TRIGGER, TANK_ECHO, TANK_DISTANCE);
OneWire           oneWire(TANK_TEMPERATURE);
IPAddress         ip(192, 168, 10, 100);
EthernetServer    server(80);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);

  pinMode(TANK_VALVE, OUTPUT);
  pinMode(GRDN_VALVE, OUTPUT);
  pinMode(GRHS_VALVE, OUTPUT);

  Ethernet.begin(mac, ip);
  sensors.begin();
  server.begin();
  dht.begin();

  Serial.print("IP address: ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  EthernetClient client = server.available();
  if (client) {
    Serial.println("Client connected");
    boolean currentLineIsBlank = true;
    while (client.connected()) {
      while (client.available()) {
        char c = client.read();
        if (c == '\n' && currentLineIsBlank) {
          while (client.available())
          {
            request += char((client.read()));
          }
          Serial.println(request);
          if (request != "") {
            if (request.indexOf("{\"name\":\"tank\",\"status\":true}") >= 0) {
              digitalWrite(TANK_VALVE, HIGH);
            } else if (request.indexOf("{\"name\":\"tank\",\"status\":false}") >= 0) {
              digitalWrite(TANK_VALVE, LOW);
            } else if (request.indexOf("{\"name\":\"garden\",\"status\":true}") >= 0) {
              digitalWrite(GRDN_VALVE, HIGH);
            } else if (request.indexOf("{\"name\":\"garden\",\"status\":false}") >= 0) {
              digitalWrite(GRDN_VALVE, LOW);
            } else if (request.indexOf("{\"name\":\"greenhouse\",\"status\":true}") >= 0) {
              digitalWrite(GRHS_VALVE, HIGH);
            } else if (request.indexOf("{\"name\":\"greenhouse\",\"status\":false}") >= 0) {
              digitalWrite(GRHS_VALVE, LOW);
            }
            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: application/json");
            client.println();
            client.println("{\"status\": {\"code\": 200, \"message\": \"OK\"}}");
          } else {
            String greenhouseTemperature;
            String greenhouseHumidity;
            String greenhouseMoisture = String(analogRead(5));

            int ping = sonar.ping();
            String tankDistance = String(ping / US_ROUNDTRIP_CM);
            String tankTemperature = String(sensors.getTempCByIndex(0));

            if (dht.read() == DHT_OK) {
              greenhouseTemperature = String(dht.getTemperatureC());
              greenhouseHumidity = String(dht.getHumidity());
            } else {
              greenhouseTemperature = String(dht.read());
              greenhouseHumidity = String(dht.read());
            }

            String gardenMoisture = String(analogRead(4));

            String tankValve = (digitalRead(TANK_VALVE) == HIGH) ? "true" : "false";
            String gardenValve = (digitalRead(GRDN_VALVE) == HIGH) ? "true" : "false";
            String greenhouseValve = (digitalRead(GRHS_VALVE) == HIGH) ? "true" : "false";

            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: application/json");
            client.println();
            client.print("{\"status\": {\"code\": 200, \"message\": \"OK\"}, \"data\": [");
            client.print("{\"name\": \"tank\", \"status\": " + tankValve + ", \"sensors\": {\"temperature\": " + tankTemperature + ", \"level\": " + tankLevel + "}}");
            client.print("{\"name\": \"garden\", \"status\": " + gardenValve + ", \"sensors\": {\"moisture\": " gardenMoisture + "}}");
            client.print("{\"name\": \"greenhouse\", \"status\": " + greenhouseValve + ", \"sensors\": {\"temperature\": " + greenhouseTemperature + ", \"humidity\": " + greenhouseHumidity + ", \"moisture\": " + greenhouseMoisture + "}}");
            client.println("]}");
          }
          client.stop();
        } else if (c == '\n') {
          currentLineIsBlank = true;
        } else if (c != '\r') {
          currentLineIsBlank = false;
        }
      }
    }
    delay(1);
    client.stop();
    Serial.println("Client disconnected");
    request = "";
  }
}
