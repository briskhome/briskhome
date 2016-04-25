/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 *
 * Модуль управления поливом.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.1.4
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const arc4 = require('arc4');
  const http = require('http');
  const dgram = require('dgram');

  const db = imports.db;
  const bus = imports.bus;
  const log = imports.log;
  const mqtt = imports.mqtt;
  const config = imports.config.irrigation;

  const Measure = db.models.Measure;
  const Sensor = db.models.Sensor;
  const Circuit = db.models.Circuit;
  const Request = db.models.Request;

  /**
   * Класс Controller представляет собой делегата, осуществляющего управление контроллером полива,
   * расположенным на объекте. В конструкторе осуществляется определение протокола взаимодействия
   * с контроллером полива и запуск периодических задач, таких как запрос сведений о состоянии и
   * первоначальная проверка на наличие открытых клапанов.
   *
   * @constructor
   */
  function Controller() {
    log.info('Инициализация контроллера полива в режиме ' + config.controller.mode.toUpperCase());

    // Добавляем отдельный журнал для хранения информации о действиях с контроллером полива.
    log.addTarget('file', { file: 'log/irrigation.log' })
      .withFormatter('commonInfoModel')
      .onlyIncluding({ file: /irrigation/ })
      .excluding({ message: /Initializing/ })
      .withHighestSeverity('debug');

    const _this = this;

    if (config.controller.mode === 'mqtt') {
      // Подписка на события от модуля `core.bus`, тема которых начинается с `irrigation`.
      // Пример такой темы: `/irrigation/circuits/garden`.
      bus.on('core.mqtt:irrigation', function (event) {
        if (event.topic.split('/')[1] === 'irrigation') {
          if (event.topic.split('/')[2] === 'circuits') {
            Circuit.findOne({ name: event.topic.split('/').pop() }, function (err, data) {
              if (err) {
                const message = 'Невозможно прочитать сообщение от контроллера';
                log.warn(message, {
                  'Причина': 'Некорректный идентификатор контура полива',
                  'Ошибка': err ? err.message : event.topic.split('/')[-1],
                });
                return;
              }

              let circuit = data[0];
              const message = JSON.parse(event.payload);
              Object.keys(message.sensors).forEach(function (sensor, index) {
                circuit.sensors[sensor] = message.sensors.sensor;
                let measure = new Measure();
                measure.sensor = String(event.topic.split('/').pop() + ':' + sensor);
                measure.value = message.sensors.sensor;
                measure.save();
              });

              circuit.save();
            });
          }
        }
      });
    }

    if (config.controller.mode === 'tcp') {
      this.cipher = arc4('arc4', config.controller.secret);
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

    updater();
    checkActiveCircuits();

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
          if (data[i].status) {
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
   * Начинает полив указанного контура.
   *
   * @param {String} id       Идентификатор или название контура полива.
   * @param {Object} options  Концигурационный объект.
   *
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
      if (circuit.status) {
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
        if (config.controller.mode === 'mqtt') {
          const message = {
            topic: '/irrigation/circuits/' + circuit.name,
            payload: '{\"status\": true}',
            qos: 0,
            retain: false,
          };
          bus.emit('core.mqtt:publish', message);
          monitor(circuit, options);
        }

        /**
         *
         */
        if (config.controller.mode === 'tcp') {
          let query = `http://${config.controller.address}?pin=${circuit.pin}&action=open`;
          http.get(query, function (res) {
            Circuit.find({ name: circuit.name }, function (err, data) {
              let object = data[0];
              object.status = true;
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

          _this.socket.send(
            buffer,
            0,
            buffer.length,
            config.controller.port,
            config.controller.address,
            function (err) {
              if (err) {
                return log.error(err);
              }

              Circuit.find({ name: circuit.name }, function (err, data) {
                let object = data[0];
                object.status = true;
                object.save();
              });

              monitor(circuit, options);
            }
          );
        }
      }
    });

    function monitor(circuit, options) {
      if ('humidity' in options) {
        log.info('Начат полив контура с ограничением по влажности почвы', {
          'Контур': circuit.name,
          'Влажность': options.humidity,
        });

        // @param {Number} overflow  Количество минут, необходимое контуру для опустошения бака.
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
   * Завершает полив указанного контура.
   *
   * @param {String} id  Идентификатор или название контура полива
   *
   * @callback callback
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
      if (!circuit.status) {
        log.warn('Невозможно завершить полив контура', {
          'Причина': 'Полив контура уже запущен',
          'Контур': circuit.name,
        });
        return;
      } else {
        log.debug('Подготовка к завершению полива контура', {
          'Контур': circuit.name,
        });

        /**
         *
         */
        if (config.controller.mode === 'mqtt') {
          const message = {
            topic: '/irrigation/circuits/' + circuit.name,
            payload: '{\"status\": false}',
            qos: 0,
            retain: false,
          };
          bus.emit('core.mqtt:publish', message);
        }

        /**
         *
         */
        if (config.controller.mode === 'tcp') {
          let query = `http://${config.controller.address}?pin=${circuit.pin}&action=close`;
          http.get(query, function (res) { // XXX Нужна проверка на пустой `res`?
            Circuit.find({ name: circuit.name }, function (err, data) {
              let object = data[0];
              object.status = false;
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

        /**
         *
         */
        if (config.controller.mode === 'udp') {
          let message = '' + Math.floor((new Date()).getTime() / 1000) + '0' + circuit.pin + '0';
          let buffer = new Buffer(message);

          _this.socket.send(
            buffer,
            0,
            buffer.length,
            config.controller.port,
            config.controller.address,
            function (err) {
              if (err) {
                log.warn('Невозможно завершить полив контура', {
                  'Причина': 'Не удалось установить соединение с контроллером полива',
                  'Ошибка': err.message,
                });
                return;
              }

              Circuit.find({ name: circuit.name }, function (err, data) {
                let object = data[0];
                object.status = false;
                object.save();
              });

              if (_this.active[circuit.name]) {
                clearInterval(_this.active[circuit.name]);
                clearTimeout(_this.active[circuit.name]);
              }

              log.info('Завершен полив контура', {
                'Контур': circuit.name,
              });
            }
          );
        }
      }
    });
  };

  /**
   * Отправляет запрос на обновление информации о состоянии контроллера полива.
   *
   * @deprecated
   */
  Controller.prototype.status = function status() {
    const _this = this;

    // В случае, если используется протокол MQTT, сообщения отправляются контроллером автоматически.
    if (config.controller.mode === 'mqtt') return;

    if (config.controller.mode === 'tcp') {
      let query = `http://${config.controller.address}`;
      http.get(query, function (res) { // XXX Нужна проверка на пустой `res`?
        log.debug('Отправлен запрос на обновление информации');

        // TODO Обработка полученной информации.

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
      _this.socket.send(
        buffer,
        0,
        buffer.length,
        config.controller.port,
        config.controller.address,
        function (err) {
          if (err) {
            log.error(err);
          }

          log.debug('Sent a request for status update', {
            message: message,
          });
        }
      );
    }
  };

  /**
   * Возвращает список доступных контуров полива, либо возвращает подробную информацию о контуре,
   * идентификатор или название которого было передано в качестве первого аргумента.
   *
   * @param {Object} id  Идентификатор или название контура полива.
   *
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

  /**
   * Зашифровывает сообщение, полученное в аргументе, с использованием ключа по методике шифрования
   * `ARC4`. Используется для подготовки сообщений к отправке контроллеру полива.
   *
   * @param {String} message  Текст, который требуется зашифровать.
   *
   * @deprecated
   */
  Controller.prototype.encode = function encode(message) {
    let encodedString = this.cipher.encodeString(message);
    return encodedString;
  };

  /**
   * Расшифровывает сообщение, полученное в аргументе, с использованием ключа по методике шифрования
   * `ARC4`. Используется для прочтения сообщений, полученных от контроллера полива.
   *
   * @param {String} message  Текст, который требуется расшифровать.
   *
   * @deprecated
   */
  Controller.prototype.decode = function decode(message, remote) {
    let decodedString = this.cipher.decodeString(message);
    log.info('Расшифровано сообщение ' + remote.address + ': ' + message);
    return decodedString;
  };

  register(null, {
    irrigation: new Controller(),
  });
};
