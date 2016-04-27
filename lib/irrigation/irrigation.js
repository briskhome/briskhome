/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 *
 * Модуль управления поливом.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.1.5
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const http = require('http');

  const db = imports.db;
  const bus = imports.bus;
  const log = imports.log;
  const mqtt = imports.mqtt;
  const config = imports.config.irrigation;

  const Record = db.models.Record;
  const Measure = db.models.Measure;
  const Circuit = db.models.Circuit;

  /**
  * Класс Controller представляет собой делегата, осуществляющего управление контроллером полива,
  * расположенным на объекте. В конструкторе осуществляется определение протокола взаимодействия
  * с контроллером полива и запуск периодических задач, таких как запрос сведений о состоянии и
  * первоначальная проверка на наличие открытых клапанов.
  *
  * @constructor
  */
  function Controller() {
    const _this = this;
    log.info('Инициализация контроллера полива в режиме ' + config.controller.mode.toUpperCase());
    log.addTarget('file', { file: 'log/irrigation.log' })
      .withFormatter('commonInfoModel')
      .onlyIncluding({ file: /irrigation/ })
      .withHighestSeverity('debug');

    /**
     * Инициализатор делегата контроллера полива по протоколу HTTP.
     */
    if (config.controller.mode === 'http') {
      _this.update = setInterval(function () {
        const request = http.request({
          host: config.controller.address,
          port: config.controller.port,
          path: '/',
          method: 'GET',
        }, function (res) {
          res.on('data', function (chunk) {
            log.trace('Обновление информации о контурах полива');

            const response = JSON.parse(chunk.toString());
            response.data.forEach(function (payload, index) {
              _this.circuits(payload.name, function (err, circuit) {
                if (err) {
                  log.warn('Некорректный идентификатор контура полива', {
                    'Код': 1,
                    'Ошибка': 'Ответ контроллера содержит некорректный идентификатор контура полива',
                    'Подробная информация': {
                      'Идентификатор контура': payload.name,
                      'Исключение': err,
                    },
                  });
                  return;
                }

                Object.keys(payload.sensors).forEach(function (sensor, index) {
                  let measure = new Measure();
                  circuit.sensors[sensor] = payload.sensors[sensor];
                  measure.sensor = String(payload.name + ':' + sensor);
                  measure.value = payload.sensors.sensor;
                  measure.save();
                });

                circuit.status = payload.status;
                circuit.save();
              }, true);
            });
          });
        });

        request.on('error', function (err) {
          log.warn('Контроллер недоступен', {
            'Код': 2,
            'Ошибка': 'Не удалось установить соединение с контроллером',
            'Подробная информация': {
              'Исключение': err,
            },
          });
          return;
        });

        request.end();
      }, config.interval * 1000);
    }

    /**
     * Инициализатор делегата контроллера полива по протоколу MQTT.
     */
    if (config.controller.mode === 'mqtt') {
      bus.on('broadcast:irrigation', function (event) {
        if (event.topic.split('/')[2] === 'circuits') {
          Circuit.findOne({ name: event.topic.split('/').pop() }, function (err, data) {
            if (err || !data) {
              const message = 'Невозможно прочитать сообщение от контроллера';
              log.warn(message, {
                'Причина': 'Некорректный идентификатор контура полива',
                'Ошибка': err ? err.message : event.topic.split('/')[-1],
              });
              return;
            }

            let circuit = data[0];
            const payload = JSON.parse(event.payload);
            Object.keys(payload.sensors).forEach(function (sensor) {
              circuit.sensors[sensor] = payload.sensors.sensor;
              let measure = new Measure();
              measure.sensor = String(event.topic.split('/').pop() + ':' + sensor);
              measure.value = payload.sensors.sensor;
              measure.save();
            });

            circuit.status = payload.status;
            circuit.save();
          });
        }
      });

      bus.on('broadcast:irrigation', function (event) {
        if (event.topic.split('/')[2] === 'circuits') {
          _this.circuits(event.topic.split('/').pop(), function (err, circuit) {
            if (err) {
              log.warn('Некорректный идентификатор контура полива', {
                'Код': 0,
                'Ошибка': 'Опубликованный топик содержит некорректный идентификатор контура полива',
                'Подробная информация': {
                  'Идентификатор контура': event.topic.split('/').pop(),
                  'Исключение': err,
                },
              });
              return;
            }

            const payload = JSON.parse(event.payload);
            Object.keys(payload.sensors).forEach(function (sensor, index) {
              let measure = new Measure();
              circuit.sensors[sensor] = payload.sensors[sensor];
              measure.sensor = String(payload.name + ':' + sensor);
              measure.value = payload.sensors.sensor;
              measure.save();
            });

            circuit.status = payload.status;
            circuit.save();
          }, true);
        }
      });
    }

    /**
     * Подписка на событие `irrigation:start`, полученное по шине событий.
     * Интерфейс для межмодульного взаимодействия без установления прямых зависимостей.
     */
    bus.on('irrigation:start', function (event) {
      log.trace('По шине событий получен запрос на включение полива', {
        'Источник': event.module,
        'Пакет данных': event.data,
      });

      const name = event.data.name;
      const options = event.data.sensors || {};

      console.log(event.data.sensors);

      _this.start(event.data.name, options);
    });

    /**
    * Подписка на событие `irrigation:stop`, полученное по шине событий.
    * Интерфейс для межмодульного взаимодействия без установления прямых зависимостей.
     */
    bus.on('irrigation:stop', function (event) {
      log.trace('По шине событий получен запрос на выключение полива', {
        'Источник': event.module,
        'Пакет данных': event.data,
      });

      const name = event.data.name;
      _this.stop(event.data.name);
    });

    /**
    * Подписка на событие `irrigation:circuits`, полученное по шине событий.
    * Интерфейс для межмодульного взаимодействия без установления прямых зависимостей.
     */
    bus.on('irrigation:circuits', function (event) {
      log.trace('По шине событий получен запрос контуров полива', {
        'Источник': event.module,
        'Пакет данных': event.data,
      });

      if (event.data.hasOwnProperty('name')) {
        _this.circuits(event.data.name, function (err, data) {
          if (err) {
            log.warn('Некорректный идентификатор контура полива', {
              'Код': 3,
              'Ошибка': 'По шине событий получен некорректный идентификатор контура полива',
              'Подробная информация': {
                'Идентификатор контура': event.data.name,
                'Исключение': err,
              },
            });
            return;
          }

          bus.emit(event.module + ':' + 'irrigation:circuits', {
            module: 'irrigation',
            data,
          });
        });
      } else {
        _this.circuits(function (err, data) {
          if (err) {
            log.warn('Не удалось загрузить информацию о конутрах полива', {
              'Ошибка': err,
            });
            log.warn('Внутренняя ошибка модуля', {
              'Код': 4,
              'Ошибка': 'Не удалось получить информацию о контурах полива из базы данных',
              'Подробная информация': {
                'Исключение': err,
              },
            });
            return;
          }

          bus.emit(event.module + ':' + 'irrigation:circuits', {
            module: 'irrigation',
            data,
          });
        });
      }

    });

    /**
     * Объект `timers` хранит таймеры активных контуров.
     * @private
     */
    _this.timers = {};

    /**
     * Функция при создании делегата контроллера проверяет наличие в базе данных
     * записей об открытых контурах и, если они есть, завершает полив таких контуров.
     * @private
     */
    (function () {
      _this.circuits(function (err, data) {
        if (err) {
          log.warn('Внутренняя ошибка модуля', {
            'Код': 5,
            'Ошибка': 'Не удалось получить информацию о контурах полива из базы данных',
            'Подробная информация': {
              'Исключение': err,
            },
          });
          return;
        }

        data.forEach(function (circuit) {
          if (circuit.status) {
            log.warn('Работа модуля была завершена некорректно', {
              'Код': 6,
              'Ошибка': 'При инициализации обнаружен включенный полив контура',
              'Подробная информация': {
                'Контур': circuit.name,
              },
            });

            _this.stop(circuit.name);
          }
        });
      });
    })();
  }

  /**
   * Начинает полив указанного контура.
   *
   * @param {String} id       Идентификатор или название контура полива.
   * @param {Object} options  Концигурационный объект.
   *
   * @callback callback
   */
  Controller.prototype.start = function start(id, options) {
    const _this = this;
    _this.circuits(id, function (err, circuit) {
      if (err) {
        log.warn('Некорректный идентификатор контура полива', {
          'Код': 7,
          'Ошибка': 'Невозможно включить полив контура с некорректным идентификатором',
          'Подробная информация': {
            'Идентификатор контура': id,
            'Исключение': err,
          },
        });
        return;
      }

      if (circuit.status) {
        log.warn('Некорректное действие', {
          'Код': 8,
          'Ошибка': 'Невозможно включить полив контура, он уже включен',
          'Подробная информация': {
            'Идентификатор контура': id,
          },
        });
        return;
      } else {
        log.trace('Обработка запроса на включение полива контура', {
          'Контур': id,
        });

        if (config.controller.mode === 'http') {
          const payload = JSON.stringify({
            name: circuit.name,
            status: true,
          });

          const request = http.request({
            host: config.controller.address,
            port: config.controller.port,
            path: '/',
            method: 'POST',
            headers: {
              'Connection': 'close',
              'Content-Type': 'application/json',
              'Content-Length': payload.length,
            },
          }, function (res) {
            res.on('data', function (chunk) {
              const response = JSON.parse(chunk.toString());
              return monitor(circuit, options);
            });
          });

          request.on('error', function (err) {
            log.warn('Контроллер недоступен', {
              'Код': 9,
              'Ошибка': 'Не удалось установить соединение с контроллером',
              'Подробная информация': {
                'Исключение': err,
              },
            });
            return;
          });

          request.write(payload);
          request.end();
        }

        if (config.controller.mode === 'mqtt') {
          bus.emit('core.mqtt:publish', {
            module: 'irrigation',
            data: {
              topic: '/irrigation/circuits/' + circuit.name,
              payload: '{\"name\": \"' + circuit.name + '\", \"status\": true}',
              qos: 0,
              retain: false,
            },
          });
          monitor(circuit, options);
        }
      }
    }, true);

    function monitor(circuit, options) {
      circuit.status = true;
      circuit.save();

      if (circuit.name === 'tank') {
        log.info('Включено наполнение резервуара', {
          'Контур': circuit.name,
          'Параметры': options || null,
        });

        _this.timers[circuit.name] = setInterval(function () {
          _this.circuits(circuit.name, function (err, tank) {
            const level = parseInt(tank.sensors.level);
            log.trace('Проверка условий для завершения полива контура', {
              'Контур': circuit.name,
              'Текущий уровень воды в резервуаре': level,
              'Максимальный уровень воды': config.max,
            });

            if (level <= config.min) {
              _this.stop(circuit.name);
            }
          });
        }, config.interval * 1000);
      } else if (options && options.hasOwnProperty('moisture') && options.moisture > 0) {
        log.info('Включен полив контура с ограничением по влажности почвы', {
          'Контур': circuit.name,
          'Параметры': options || null,
        });

        _this.timers[circuit.name] = setInterval(function () {
          _this.circuits('tank', function (err, tank) {
            _this.circuits(circuit.name, function (err, data) {
              const level = parseInt(tank.sensors.level);
              const moisture = parseInt(data.sensors.moisture);
              log.trace('Проверка условий для завершения полива контура', {
                'Контур': circuit.name,
                'Текущая влажность почвы': moisture,
                'Максимальное значение влажности': options.moisture,
                'Текущий уровень воды в резервуаре': level,
                'Минимальный уровень воды': config.max,
              });

              if (moisture >= options.moisture || level >= config.max) {
                _this.stop(circuit.name);
              }
            });
          });
        }, config.interval * 1000);
      } else if (options && options.hasOwnProperty('period') && options.period > 0) {
        log.info('Включен полив контура с ограничением по времени', {
          'Контур': circuit.name,
          'Параметры': options || null,
        });

        let i = options.period / config.interval;
        _this.timers[circuit.name] = setInterval(function () {
          _this.circuits('tank', function (err, tank) {
            _this.circuits(circuit.name, function (err, data) {
              const level = parseInt(tank.sensors.level);
              log.trace('Проверка условий для завершения полива контура', {
                'Контур': circuit.name,
                'Текущий уровень воды в резервуаре': level,
                'Минимальный уровень воды': config.max,
                'Осталось времени': i,
              });

              if (!i || level >= config.max) {
                _this.stop(circuit.name);
              }

              i--;
            });
          });
        }, config.interval * 1000);
      } else {
        log.info('Включен полив контура без указания ограничений', {
          'Контур': circuit.name,
          'Параметры': options || null,
        });

        _this.timers[circuit.name] = setInterval(function () {
          _this.circuits('tank', function (err, tank) {
            const level = parseInt(tank.sensors.level);
            log.trace('Проверка условий для завершения полива контура', {
              'Контур': circuit.name,
              'Текущий уровень воды в резервуаре': level,
              'Минимальный уровень воды': config.max,
            });

            if (level >= config.max) {
              _this.stop(circuit.name);
            }
          });
        }, config.interval * 1000);
      }
    }
  };

  Controller.prototype.stop = function stop(id, callback) {
    const _this = this;
    clearInterval(_this.timers[id]);
    _this.circuits(id, function (err, circuit) {
      if (err) {
        log.warn('Некорректный идентификатор контура полива', {
          'Код': 10,
          'Ошибка': 'Невозможно выключить полив контура с некорректным идентификатором',
          'Подробная информация': {
            'Идентификатор контура': id,
            'Исключение': err,
          },
        });
        return;
      }

      if (!circuit.status) {
        log.warn('Некорректное действие', {
          'Код': 11,
          'Ошибка': 'Невозможно выключить полив контура, он уже выключен',
          'Подробная информация': {
            'Идентификатор контура': id,
          },
        });
        return;
      } else {
        log.trace('Обработка запроса на выключение полива контура', {
          'Контур': id,
        });

        if (config.controller.mode === 'http') {
          const payload = JSON.stringify({
            name: circuit.name,
            status: false,
          });

          const request = http.request({
            host: config.controller.address,
            port: config.controller.port,
            path: '/',
            method: 'POST',
            headers: {
              'Connection': 'close',
              'Content-Type': 'application/json',
              'Content-Length': payload.length,
            },
          }, function (res) {
            res.on('data', function (chunk) {
              const response = JSON.parse(chunk.toString());
              /*
                Ответ должен быть 200 OK, в противном случае контроллер настроен некорректно.
              */
              circuit.status = false;
              circuit.save();

              log.info('Полив контура выключен', {
                'Контур': circuit.name,
              });
            });
          });

          request.on('error', function (err) {
            log.warn('Контроллер недоступен', {
              'Код': 12,
              'Ошибка': 'Не удалось установить соединение с контроллером',
              'Подробная информация': {
                'Исключение': err,
              },
            });
            return;
          });

          request.write(payload);
          request.end();
        }

        if (config.controller.mode === 'mqtt') {
          bus.emit('core.mqtt:publish', {
            module: 'irrigation',
            data: {
              topic: '/irrigation/circuits/' + circuit.name,
              payload: '{\"name\": \"' + circuit.name + '\", \"status\": false}',
              qos: 0,
              retain: false,
            },
          });

          circuit.status = false;
          circuit.save();

          log.info('Полив контура выключен', {
            'Контур': circuit.name,
          });
        }
      }
    }, true);
  };

  /**
   * Возвращает список доступных контуров полива, либо возвращает подробную информацию о контуре,
   * идентификатор или название которого было передано в качестве первого аргумента.
   *
   * @param {Object}  id     Идентификатор или название контура полива.
   * @param {Boolean} mongo  Признак, указывающий на необходимость возврата документа Mongoose.
   *
   * @callback callback
   */
  Controller.prototype.circuits = function circuits(id, callback, mongoose) {
    const _this = this;
    const done = function (err, data) {
      if (err) {
        callback(err);
      } else if (typeof id === 'string' && (!data || typeof data === 'undefined')) {
        callback(true);
      } else if (typeof id === 'function' && (!data.length || typeof data === 'undefined')) {
        callback(true);
      } else {
        return callback(null, data);
      }
    };

    if (typeof id === 'string') {
      let ObjectId = require('mongoose').Types.ObjectId;
      let circuitName = id;
      let circuitId = new ObjectId(circuitName.length < 12 ? '000000000000' : circuitName);
      if (mongoose) {
        Circuit.findOne({ $or: [{ _id: circuitId }, { name: circuitName }] })
          .exec(done);
      } else {
        Circuit.findOne({ $or: [{ _id: circuitId }, { name: circuitName }] })
          .select('-_id')
          .select('-__v')
          .lean()
          .exec(done);
      }
    }

    if (typeof id === 'function') {
      callback = id;
      if (mongoose) {
        Circuit.find({})
          .exec(done);
      } else {
        Circuit.find({})
          .select('-_id')
          .select('-__v')
          .lean()
          .exec(done);
      }
    }
  };

  register(null, {
    irrigation: new Controller(),
  });
};
