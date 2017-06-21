/**
 * @briskhome
 * └core.bus <lib/core.bus/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

const Emitter = require('events').EventEmitter;
const mosca = require('mosca');
const util = require('util');

export default (options, imports, register) => {
  const log = imports.log({ event: 'object' });

  const params = {
    port: options.port,
    backend: {
      type: 'mongo',
      url: `mongodb://${options.username}:${options.password}@${options.hostname}/${options.database}`,
      pubsubCollection: 'mqtt',
      mongo: {},
    },
  };

  function Bus() {
    this.mqtt = new mosca.Server(params);

    this.mqtt.on('clientConnected', (client) => {
      log.trace('Получен запрос на регистрацию устройства', client.id);
    });

    this.mqtt.on('published', (packet, client) => {
      if (client) {
        log.trace('Получено сообщение по протоколу MQTT', {
          Тема: packet.topic,
          Содержание: packet.payload.toString(),
        });
      }
    });

    this.mqtt.on('ready', () => {

    });
  }

  util.inherits(Bus, Emitter);

  register(null, { bus: new Bus() });
};
