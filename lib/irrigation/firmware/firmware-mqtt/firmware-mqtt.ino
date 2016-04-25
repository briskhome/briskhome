/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ firmware/firmware-mqtt.ino
 *
 * Скетч для работы контроллера полива по протоколу MQTT.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.1.4
 */

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <TroykaDHT11.h>
#include <NewPing.h>

#define DHT_PIN 0
#define TANK_VALVE 4
#define TANK_TEMPERATURE 8
#define GRHS_VALVE 5
#define GRHS_MOISTURE 9
#define GRDN_VALVE 6
#define GRDN_MOISTURE 10

#define TRIGGER_PIN  12
#define ECHO_PIN     11
#define MAX_DISTANCE 200

// Время последнего отправленного сообщения о статусе
unsigned long time;
// Буфер для хранения входящего сообщения
char message_out[256];
byte mac[]    = {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED };
IPAddress ip(192, 168, 0, 177);
IPAddress server(192, 168, 0, 3);

void callback(char* topic, byte* payload, unsigned int length);

DHT11 dht(DHT_PIN);
EthernetClient ethClient;
PubSubClient client(server, 1883, callback, ethClient);
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

/**
 * Функция обратного вызова для обработки полученных от сервера сообщений.
 * Соответствует протоколу взаимодействия версии 0.1.4.
 */
void callback(char* topic, byte* payload, unsigned int length) {
  int i;
  char message_in[256];
  for (i = 0; i < length; i++) {
    message_in[i] = payload[i];
  }
  message_in[i] = '\0';
  String status = String(message_in);
  String circuit = String(topic).substring(String(topic).lastIndexOf('/'));
  if (circuit == "input") {
    if (status == "{\"status\": true}") {
      digitalWrite(TANK_VALVE, HIGH);
    } else if (status == "{\"status\": false}") {
      digitalWrite(TANK_VALVE, LOW);
    }
  }

  if (circuit == "garden") {
    if (status == "{\"status\": true}") {
      digitalWrite(GRDN_VALVE, HIGH);
    } else if (status == "{\"status\": false}") {
      digitalWrite(GRDN_VALVE, LOW);
    }
  }

  if (circuit == "greenhouse") {
    if (status == "{\"status\": true}") {
      digitalWrite(GRHS_VALVE, HIGH);
    } else if (status == "{\"status\": false}") {
      digitalWrite(GRHS_VALVE, LOW);
    }
  }
}

void setup() {
  dht.begin();
  Ethernet.begin(mac, ip);
}

void loop() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("arduinoClient", "testuser", "testpass")) {
      Serial.println("connected");

      client.publish("/irrigation/controller", "{\"online\": true}");
      client.subscribe("/irrigation/circuits/input");
      client.subscribe("/irrigation/circuits/garden");
      client.subscribe("/irrigation/circuits/greenhouse");

      if (millis() > (time + 30000)) {
        int ping = sonar.ping();
        String tankVolume = String(ping / US_ROUNDTRIP_CM);
        uint8_t GRHS_TEMPERATURE;
        uint8_t GRHS_HUMIDITY;
        if (dht.read() == DHT_OK) {
          GRHS_TEMPERATURE = dht.getTemperatureC();
          GRHS_HUMIDITY = dht.getHumidity();
        }

        String input = "{\"name\": \"input\", ";
        input += "\"status\": " + String(digitalRead(TANK_VALVE)) + ", ";
        input += "\"sensors\": { \"temperature\": 0 } ";
        input += "}";
        input.toCharArray(message_out, input.length() + 1);
        client.publish("/irrigation/circuits/input", message_out);
        Serial.println(input);

        String garden = "{\"name\": \"garden\", ";
        garden += "\"status\": " + String(digitalRead(GRDN_VALVE)) + ", ";
        garden += "\"sensors\": { \"moisture\": " + String(digitalRead(GRDN_MOISTURE)) + " } ";
        garden += "}";
        garden.toCharArray(message_out, garden.length() + 1);
        client.publish("/irrigation/circuits/input", message_out);
        Serial.println(garden);

        String greenhouse = "{\"name\": \"greenhouse\", ";
        greenhouse += "\"status\": " + String(digitalRead(GRHS_VALVE)) + ", ";
        greenhouse += "\"sensors\": { ";
        greenhouse += "\"moisture\": " + String(digitalRead(GRHS_MOISTURE)) + ", ";
        greenhouse += "\"humidity\": " + String(digitalRead(GRHS_HUMIDITY)) + ", ";
        greenhouse += "\"temperature\": " + String(digitalRead(GRHS_TEMPERATURE)) + ", ";
        greenhouse += "} ";
        greenhouse += "} ";
        greenhouse.toCharArray(message_out, greenhouse.length() + 1);
        client.publish("/irrigation/circuits/input", message_out);
        Serial.println(greenhouse);

        time = millis();
      }
      client.loop();
      delay(5000);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 1 second");
      delay(1000);
    }
  }
}
