/**
 * @briskhome/onewire <lib/onewire/index.js>
 *
 * 1-wire extension module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const db = imports.db;
  const log = imports.log('onewire');
  const config = imports.config('onewire');

  const Device = db.model('core:device');
  const Reading = db.model('core:reading');
  const Sensor = db.model('core:sensor');

  const Client = require('owfs').Client;

  /**
   * @constructor
   */
  function Onewire() {

    log.info('Инициализация модуля 1-wire');

    /** @property {Object} connections  Список соединений */
    /** @todo Следует использовать свойство, а не переменную в конструкторе */
    let connections = [];

    /** @todo Инициализатор следует вынести в отдельную функцию */
    Device.find({ 'services.onewire': { $exists: true } }).lean().exec(init);
    function init(err, devices) {
      devices.forEach(function (device) {
        log.debug('Установка соединения с сервером OWFS по адресу', device.address);
        const connection = new Client(device.address);
        connections.push(connection);
      });
    }

    const updater = setInterval(function () {
      log.debug('Опрос подключенных датчиков 1-wire');
      connections.forEach(function (connection) {
        connection.dir('/', function (err, directories) {
          if (err) {
            log.warn({ data: err });
            return;
          }

          // log.trace({ data: directories });
          directories.forEach(function (directory) {
            switch (directory.substring(1, 3)) {
              case '28': {
                connection.read(directory + '/temperature', function (err, value) {
                  if (err) {
                    log.warn({ data: err });
                    return;
                  }

                  Sensor.findOne({ serial: directory.substring(1) }, function (err, sensor) {
                    if (err) {
                      log.warn(err);
                      return;
                    }

                    /**
                     * @todo
                     * Инициализатор сенсора следует вынести в отдельную функцию.
                     * При инициализации сенсоров считывать первые показания.
                     */
                    if (!sensor) {
                      sensor = new Sensor();

                      // sensor.device = ?
                      sensor.serial = directory.substring(1);
                      sensor.kind = 'temperature';
                      sensor.save();
                    }

                    Reading.findOne({ timestamp: new Date().setUTCHours(0, 0, 0, 0), sensor: sensor._id }, function (err, reading) {
                      if (err) {
                        log.warn(err);
                        return;
                      }

                      if (!reading) {
                        reading = new Reading();
                        reading.sensor = sensor._id;

                        // reading.timestamp = new Date().setUTCHours(0, 0, 0, 0);
                        reading.values = [];
                      }

                      reading.values.push({ value });
                      reading.save(function (err, data) {
                        // log.trace(err, data);
                      });
                    });
                  });
                });

                break;
              }
            }
          });
        });
      });
    }, 60 * 1000);
  }

  register(null, {
    onewire: new Onewire(),
  });

};
