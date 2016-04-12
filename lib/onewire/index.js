/**
 * @briskhome/onewire <lib/onewire/index.js>
 *
 * 1-wire extension module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const db = imports.db;
  const log = imports.log;

  const Sensor = db.models.Sensor;

  const Client = require('owfs').Client;
  const connection = new Client('10.29.0.10');

  log.info('Инициализация модуля 1-wire', connection);

  const updater = setInterval(function () {
    log.debug('Опрос подключенных датчиков 1-wire');
    connection.dir('/', function (err, directories) {
      directories.forEach(function (dir) {
        switch (dir.substring(0, 2)) {
          case '28': {
            connection.read(dir + '/temperature', function (err, data) {
              let sensor = new Sensor();
              sensor.name = dir;
              sensor.module = 'onewire';
              sensor.kind = 'temperature';
              sensor.value = data;
            });

            break;
          }
        }
      });
    });
  }, 60000);

  register(null, {
    onewire: connection,
  });

};
