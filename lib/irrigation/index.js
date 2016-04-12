/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 *
 * Greenhouse watering and climate control module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

// TODO v1.0.0
//  [ ] Data encryption. Currently all data is sent via UDP/TCP unencrypted ergo
//      anyone can plug into our network and send irrigation commands directly
//      to the controller.
//  [ ] Unit tests.
//  [ ] Add check for disabled circuit.

// TODO v0.1.2
//  [ ] Logic for incoming messages (udp).
//  [x] Improved logic for irrigation timeouts and intervals.
//  [?] Move logger declaration out of @constructor.
//  [x] Include companion Arduino Sketch.

// TODO v0.1.3
//  [ ] Implement access_token for the controller messages with cipher.

'use strict';

module.exports = function setup(options, imports, register) {

  const arc4 = require('arc4');
  const http = require('http');
  const dgram = require('dgram');

  const db = imports.db;
  const log = imports.log;
  const config = imports.config.irrigation;

  const Circuit = db.models.Circuit;
  const Request = db.models.Request;
  const Sensor = db.models.Sensor;

  /**
   * The Controller class ...
   *
   * @constructor
   */
  function Controller() {

    // Adding log target that will collect all log messages from irrigation
    // controller so that main logfile stays brief and up to the point.

    log.info('Инициализация контроллера полива в режиме ' + config.controller.mode.toUpperCase());

    log.addTarget('file', { file: 'log/irrigation.log' })
      .withFormatter('commonInfoModel')
      .onlyIncluding({ file: /irrigation/ })
      .excluding({ message: /Initializing/ })
      .withHighestSeverity('debug');

    const _this = this;

    if (config.controller.mode === 'tcp') {
      this.cipher = arc4('arc4', config.controller.secret);

      updater();
      checkActiveCircuits();
    }

    if (config.controller.mode === 'udp') {
      this.cipher = arc4('arc4', config.controller.secret);
      this.socket = dgram.createSocket('udp4');
      this.socket.on('listening', function () {
        let address = this.address();
        log.info('Инициализация контроллера полива', {
          'Режим': config.controller.mode,
          'Адрес': address.address,
          'Порт': address.port,
        });

        updater();
        checkActiveCircuits();
      });

      this.socket.on('message', function (message, remote) {
        if (remote.address === '127.0.0.1') {
          let req = new Request();
          req.body = message.toString();
          req.save();
          return;
        } else {
          log.debug('Получено ' + message.length + ' байтов от удаленного хоста', {
            event: 'message',
            'Адрес': remote.address,
            'Порт': remote.port,
            'Данные': message.toString(),
          });
          try {
            let response = JSON.parse(message.toString());
            Request.find({ body: response.data.request }, function (err, data) {
              if (err || !data.length) {
                log.warn('Ответ контроллера не относится ни к одному из отправленных запросов', {
                  'Данные': response,
                });
              }

              let request = data[0];
              request.response = response;
              request.save();
            });
          } catch (e) {
            log.warn('Ответ контроллера не соответствует установленному протоколу');
          }

          // XXX this.decode(message, remote);
          // XXX DB LOGIC HERE
        }
      });

      this.socket.on('error', function (err) {
        log.error(err);
      });

      this.socket.bind(
        config.controller.port,
        config.controller.address
      );
    }

    this.active = {};

    function updater() {
      _this.updater = setInterval(function () {
        _this.status();
      }, config.interval * 1000);
    }

    function checkActiveCircuits() {
      _this.circuits(function (err, data) {
        if (err) {
          log.error(err);
        }

        for (let i = 0; i < data.length; i++) {
          if (data[i].isActive) {
            log.warn('При инициализации обнаружен открытый клапан, полив контура будет завершен', {
              'Контур': data[i].name,
            });
            _this.stop(data[i].name);
          }
        }
      });
    }
  }

  /**
   * Starts watering a selected circuit.
   *
   * This method ...
   *
   * @param {string} circuit  Identifier or name of the circuit to be toggled.
   * @param {number} timeout  Amount of time the circuit should be open for.
   * @param {number} humidity Humidity value upon reaching which the watering
   *        should be stopped.
   * @callback callback
   */
  Controller.prototype.start = function start(id, options, callback) {
    const _this = this;
    _this.circuits(id, function (err, data) {
      if (err || !data.length) {
        const message = 'Невозможно начать полив контура';
        log.warn(message, {
          'Причина': 'Некорректный идентификатор контура полива',
          'Ошибка': err ? err.message : id,
        });
        return;
      }

      let circuit = data[0];
      if (circuit.isActive) {
        const message = 'Невозможно начать полив контура';
        log.warn(message, {
          'Причина': 'Полив контура уже запущен',
          'Контур': circuit.name,
        });
        return;
      } else {
        log.debug('Подготовка к началу полива контура', {
          'Контур': circuit.name,
        });

        /**
         *
         */
        if (config.controller.mode === 'tcp') {
          let query = `http://${config.controller.address}?pin=${circuit.pin}&action=open`;
          http.get(query, function (res) {
            Circuit.find({ name: circuit.name }, function (err, data) {
              let object = data[0];
              object.isActive = true;
              object.save();
            });

            monitor(circuit, options);
          }).on('error', function (err) {
            const message = 'Невозможно начать полив контура';
            log.warn(message, {
              'Причина': 'Не удалось установить соединение с контроллером полива',
              'Ошибка': err.message,
            });
            return;
          });
        }

        /**
         *
         */
        if (config.controller.mode === 'udp') {
          log.debug('Atttempting to start irrigation of a circuit', {
            circuit: circuit.name,
          });

          let message = '' + Math.floor((new Date()).getTime() / 1000) + '0' + circuit.pin + '1';
          let buffer = new Buffer(message);

          _this.socket.send(buffer, 0, buffer.length, config.controller.port, config.controller.address, function (err) {
            if (err) {
              return log.error(err);
            }

            Circuit.find({ name: circuit.name }, function (err, data) {
              let object = data[0];
              object.isActive = true;
              object.save();
            });

            callback();
            monitor(circuit, options);
          });
        }
      }
    });

    function monitor(circuit, options) {
      if ('humidity' in options) {
        log.info('Начат полив контура с ограничением по влажности почвы', {
          'Контур': circuit.name,
          'Влажность': options.humidity,
        });

        // XXX Add overflow description.
        //
        //
        let overflow = Math.floor(config.reservoir / circuit.flow);
        _this.active[circuit.name] = setInterval(function () {
          _this.circuits(circuit.name, function (err, data) {
            log.trace('Проверка условий для завершения полива контура', {
              'Контур': circuit.name,
              'Ожидаемая влажность': options.humidity,
              'Текущая влажность': data[0].humidity,
              'Времени до опустошения резервуара': overflow,
            });
            let currentHumidity = parseInt(data[0].humidity);
            if (currentHumidity >= options.humidity || !overflow) {
              clearInterval(_this.active[circuit.name]);
              _this.stop(circuit.name);
            }

            overflow--;
          });
        }, 60000);
      } else {
        log.debug('Начат полив контура с ограничением по времени', {
          'Контур': circuit.name,
          'Таймер': 'period' in options ? options.period : 900000,
        });

        let period = options.period > 0 ? options.period : 900000;
        let overflow = Math.floor(config.reservoir / circuit.flow);
        _this.active[circuit.name] = setTimeout(function () {
          _this.stop(circuit.name);
        }, period);
      }
    }
  };

  /**
   * Stops irrigation of a circuit.
   *
   * This method ...
   *
   * @param {Object} circuit
   */
  Controller.prototype.stop = function stop(id, callback) {
    const _this = this;
    _this.circuits(id, function (err, data) {
      if (err || !data.length) {
        log.warn('Невозможно завершить полив контура', {
          'Причина': 'Некорректный идентификатор контура полива',
          'Ошибка': err ? err.message : id,
        });
        return;
      }

      let circuit = data[0];
      if (!circuit.isActive) {
        log.warn('Невозможно завершить полив контура', {
          'Причина': 'Полив контура уже запущен',
          'Контур': circuit.name,
        });
        return;
      } else {
        log.debug('Подготовка к завершению полива контура', {
          'Контур': circuit.name,
        });

        if (config.controller.mode === 'tcp') {
          let query = `http://${config.controller.address}?pin=${circuit.pin}&action=close`;
          http.get(query, function (res) { // XXX Need check for res?
            Circuit.find({ name: circuit.name }, function (err, data) {
              let object = data[0];
              object.isActive = false;
              object.save();
            });
          }).on('error', function (err) {
            log.warn('Невозможно завершить полив контура', {
              'Причина': 'Не удалось установить соединение с контроллером полива',
              'Ошибка': err.message,
            });
            return;
          });

          if (_this.active[circuit.name]) {
            clearInterval(_this.active[circuit.name]);
            clearTimeout(_this.active[circuit.name]);
          }

          log.info('Завершен полив контура', {
            'Контур': circuit.name,
          });
        }

        if (config.controller.mode === 'udp') {
          let message = '' + Math.floor((new Date()).getTime() / 1000) + '0' + circuit.pin + '0';
          let buffer = new Buffer(message);

          _this.socket.send(buffer, 0, buffer.length, config.controller.port, config.controller.address, function (err) {
            if (err) {
              log.warn('Невозможно завершить полив контура', {
                'Причина': 'Не удалось установить соединение с контроллером полива',
                'Ошибка': err.message,
              });
              return;
            }

            Circuit.find({ name: circuit.name }, function (err, data) {
              let object = data[0];
              object.isActive = false;
              object.save();
            });

            if (_this.active[circuit.name]) {
              clearInterval(_this.active[circuit.name]);
              clearTimeout(_this.active[circuit.name]);
            }

            log.info('Завершен полив контура', {
              'Контур': circuit.name,
            });
          });
        }
      }
    });
  };

  /**
   * Posts a request for regular status information.
   *
   * This method ...
   *
   * @param {Object} circuit
   * @callback callback
   */
  Controller.prototype.status = function status() {
    const _this = this;
    if (config.controller.mode === 'tcp') {
      let query = `http://${config.controller.address}`;
      http.get(query, function (res) { // XXX Need check for res?
        log.debug('Отправлен запрос на обновление информации');
      }).on('error', function (err) {
        log.warn('Невозможно отправить запрос на обновление информации', {
          'Причина': 'Не удалось установить соединение с контроллером полива',
          'Ошибка': err.message,
        });
        return;
      });
    }

    if (config.controller.mode === 'udp') {
      let message = '' + Math.floor((new Date()).getTime() / 1000) + '999';
      let buffer = new Buffer(message);
      _this.socket.send(buffer, 0, buffer.length, config.controller.port, config.controller.address, function (err) {
        if (err) {
          log.error(err);
        }

        log.debug('Sent a request for status update', {
          message: message,
        });
      });
    }
  };

  /**
   * Returns information about available circuits.
   *
   * This method ...
   *
   * @param {Object} circuit
   * @callback callback
   */
  Controller.prototype.circuits = function circuits(id, callback) {
    if (typeof id === 'string') {
      let ObjectId = require('mongoose').Types.ObjectId;
      let circuitName = id;
      let circuitId = new ObjectId(circuitName.length < 12 ? '000000000000' : circuitName);
      Circuit.find({ $or: [{ _id: circuitId }, { name: circuitName }] }).lean().exec(done);
    }

    if (typeof id === 'function') {
      callback = id;
      Circuit.find({}).lean().exec(done);
    }

    function done(err, data) {
      if (err) callback(err);
      return callback(null, data);
    }
  };

  Controller.prototype.encode = function encode(message) {
    let encodedString = this.cipher.encodeString(message);
    return encodedString;
  };

  Controller.prototype.decode = function decode(message, remote) {
    let decodedString = this.cipher.decodeString(message);
    log.info('Decoded message ' + remote.address + ': ' + message);
    return decodedString;
  };

  register(null, {
    irrigation: new Controller(),
  });
};
