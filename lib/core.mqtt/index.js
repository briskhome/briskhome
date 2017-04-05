/**
 * @briskhome/core.mqtt <lib/core.mqtt/index.js>
 *
 * Модуль поддержки протокола MQTT.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 */

'use strict';

const mosca = require('mosca');

module.exports = function (options, imports, register) {
  const db = imports.db;
  const bus = imports.bus;
  const config = imports.config('core.mqtt');
  const log = imports.log();

  const Device = db.models.Device;

  var ascoltatore = {
    type: 'mongo',
    url: 'mongodb://' + config.user + ':' + config.pass + '@' + config.host + '/' + config.name,
    pubsubCollection: 'mqtt',
    mongo: {},
  };

  var settings = {
    port: config.port,
    backend: ascoltatore,
  };

  var server = new mosca.Server(settings);

  server.on('ready', function () {
    log.info('Инициализация протокола MQTT');
    server.authenticate = authenticate;
    register(null, {
      mqtt: server,
    });
  });

  server.on('clientConnected', function (client) {
    log.trace('Получен запрос на регистрацию устройства', client.id);
  });

  // fired when a message is received
  server.on('published', function (packet, client) {
    if (client) {
      log.trace('Получено сообщение по протоколу MQTT', {
        'Тема': packet.topic,
        'Содержание': packet.payload.toString(),
      });
      bus.emit('core.mqtt:' + packet.topic.split('/')[1], {
        module: require('./package.json').name,
        client: client.id,
        topic: packet.topic,
        payload: packet.payload.toString(),
      });
    }
  });

  /**
   *
   */
  const authenticate = function (client, username, password, callback) {
    Device.findOne({ username: username, password: password }, function (err, data) {
      if (err) {
        log.warn('Произошла ошибка при обращении к базе данных');
        callback(err);
      }

      if (!data) {
        log.warn('Получен запрос на авторизацию от неопознанного устройства', client.id);
        callback(true);
      } else {
        client.user = username;
        callback(null, true);
      }
    });
  };

  /**
   * Данный подписчик предоставляет другим модулям событийно-ориентированное API для отправки
   * сообщений по протоколу MQTT. Для отправки сообщения необходимо импортировать в свой модуль
   * системный модуль шины данных `core.bus` и отправить сообщение с темой `core.mqtt:publish`.
   *
   * @param {Object} message  Объект, содержащий данные для отправки.
   */
  bus.on('core.mqtt:publish', function (message) {
    log.debug('Подготовка к отправке сообщения в топик', message.topic);
    server.publish(message, function () {
      log.info('Отправлено сообщение в топик', message.topic);
    });
  });
};
