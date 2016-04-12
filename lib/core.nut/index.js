/**
 * @briskhome/core.nut <lib/core.nut/index.js>
 *
 * Network UPS monitoring module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const bus = imports.bus;
  const config = imports.config;

  const fs = require('fs');

  const Nut = require('node-nut');

  const server = new Nut(config.nut.port, config.nut.address);

  server.on('error', function (err) {
    log.error('Не удалось установить соединение с сервером мониторинга питания');
    register(err);
  });

  server.on('close', function () {
    log.trace('Соединение с сервером мониторинга питания закрыто');
  });

  server.on('ready', function () {
    this.GetUPSList(function (upslist) {
      log.info('Инициализация модуля мониторинга питания');
      log.trace(upslist);
      this.close();
    }.bind(this));

    let wasOffline = false;
    const rainCheck = setInterval(function () {
      fs.access('/opt/briskhome/dev/killpower', function (err) {
        if (err) {
          if (wasOffline) {
            log.info('Электропитание восстановлено');
            wasOffline = false;
          }
        } else {
          if (!wasOffline) {
            log.warn('Электропитание отключено, переход на питание от батарей');
            wasOffline = true;
          }
        }
      });
    }, 1000);

    register(null, {
      nut: server,
    });
  });

  server.start();
};
