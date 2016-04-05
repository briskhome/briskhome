/**
 * @briskhome/firmware
 *
 * Irrigation controller firmware.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.2
 */

#include <SPI.h>
#include <Ethernet2.h>
#include <EthernetUdp2.h>
#include <String.h>
#define UDP_TX_PACKET_MAX_SIZE 48

#define DROP_VALVE 4  // Relay pin for drop watering valve
#define GRDN_VALVE 5  // Relay pin for garden watering valve.

// // // // // // // // // // // // // // // // // // // // // // // // // // //

byte mac[] = {        // MAC and IP address of Ethernet Shield.
  0x62, 0x69, 0x63, 0x74, 0x72, 0x6C
};
IPAddress ip(10, 29, 0, 9);

unsigned int localPort = 8888;      // local port to listen on

EthernetUDP Udp;

char packetBuffer[UDP_TX_PACKET_MAX_SIZE]; //buffer to hold incoming packet,
// char ReplyBuffer[] = "acknowledged";       // a string to send back

void setup() {
  Ethernet.begin(mac, ip);
  Udp.begin(localPort);

  Serial.begin(9600);
}

void loop() {
  // If the packet is availabe, parse it.
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Udp.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
    String req = String(packetBuffer);
    Serial.print('req: ');
    Serial.println(req);
    // String req = "12345.01234.120";
    String timestamp = req.substring(0, req.indexOf('.') - 1);
    Serial.print('timestamp: ');
    Serial.println(timestamp);
    if (req.indexOf('.') == req.lastIndexOf('.')) {
      String num = req.substring(req.indexOf('.') + 1);
    } else {
      String num = req.substring(req.indexOf('.' + 1), req.lastIndexOf('.') -1);
      String cmd = req.substring(req.lastIndexOf('.'));

      Serial.print('num: ');
      Serial.println(num);
      Serial.print('cmd: ');
      Serial.println(cmd);

      if (cmd.substring(0, 1).toInt() == DROP_VALVE) {
        int(cmd.charAt(2)) == 1 ? pinMode(DROP_VALVE, HIGH) : pinMode(DROP_VALVE, LOW);
      }
      if (cmd.substring(0, 1).toInt() == GRDN_VALVE) {
        int(cmd.charAt(2)) == 1 ? pinMode(GRDN_VALVE, HIGH) : pinMode(GRDN_VALVE, LOW);
      }

      String res = "{timestamp: " + timestamp + ", request: " + num + ", status: success}";
      char outBuffer[UDP_TX_PACKET_MAX_SIZE];
      res.toCharArray(outBuffer, UDP_TX_PACKET_MAX_SIZE);
      Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
      Udp.write(outBuffer);
      Udp.endPacket();

    }

    // reply
    // Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
    // Udp.write(ReplyBuffer);
    // Udp.endPacket();

  }
  delay(10);
}
