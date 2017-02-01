/**
 * @briskhome
 * └briskhome-ups <briskhome-ups/index.js>
 *
 * Компонент мониторинга бесперебойного электропитания.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

const async = require('async');
const Client = require('node-nut');

module.exports = function setup(options, imports, register) {
  const db = imports.db;
  const bus = imports.bus;
  const log = imports.log('nut');
  // const config = imports.config('nut');

  const Device = db.model('core:device');

  function Ups() {
    log.info('Инициализация модуля мониторинга питания');

    /** @property {Object} connections  Хэш зарегистрированных соединений */
    this.connections = {};
    this.onbattery = [];

    // TODO: Изменить на config.env
    if (process.env.NODE_ENV !== 'development') {
      this.init(() => {
        setInterval(this.update(), 10 * 1000);
      });
    }
  }

  Ups.prototype.init = function init(cb) {
    Device
      .find({ 'services.ups': { $exists: true } })
      .select('address')
      .lean()
      .exec((deviceFindErr, deviceFindRes) => {
        done.call(this, deviceFindErr, deviceFindRes);
      });

    function done(deviceFindErr, deviceFindRes) {
      if (deviceFindErr) {
        log.warn({ err: deviceFindErr });
        return cb(deviceFindErr);
      }

      if (!deviceFindRes.length) {
        const noDevicesErr = new Error('Нет зарегистрированных устройств');
        log.warn({ err: noDevicesErr });
        return cb(null);
      }

      return async.each(deviceFindRes, (device, deviceDone) => {
        if (Object.prototype.hasOwnProperty.call(this.connections, device._id)) {
          return deviceDone();
        }

        log.debug('Установка соединения с сервером мониторинга питания');
        this.connections[device._id] = new Client(3493, device.address);
        this.connections[device._id]._id = device._id;
        return deviceDone();
      }, () => cb(null));
    }
  };

  Ups.prototype.update = function update() {
    async.each(Object.keys(this.connections), (device, deviceDone) => {
      const connection = this.connections[device];
      connection.on('error', (connectionErr) => {
        log.warn({ err: connectionErr, data: { device } },
          'Не удалось установить соединение с сервером мониторинга питания'
        );
        return deviceDone();
      });

      connection.on('close', () => {
        log.trace({ data: { device } },
          'Соединение с сервером мониторинга питания закрыто'
        );
      });

      connection.on('ready', () => {
        log.debug('Добавлен сервер питания', device);
        connection.GetUPSList((upsList) => {                         // eslint-disable-line new-cap
          async.each(Object.keys(upsList), (ups, upsDone) => {
            connection.GetUPSVars(ups, (varList) => {                // eslint-disable-line new-cap
              const status = varList['ups.status'];
              if (this.onbattery.indexOf(device) >= 0) {
                if (status === 'OB') {
                  if (parseInt(varList['battery.charge']) < 20) {
                    bus.emit('nut:willShutdown');
                  }
                }

                if (status === 'OL') {
                  log.debug('Электропитание восстановлено');
                  this.onbattery.splice(this.onbattery.indexOf(device), 1);
                  bus.emit('nut:powerOnline');
                }
              }

              if (status === 'OB') {
                log.debug('Электропитание отключено, питание от батарей');
                this.onbattery.push(device);
                bus.emit('nut:powerOffline');
              }

              connection.close();
              return upsDone();
            });
          }, () => deviceDone());
        });
      });

      connection.start();
    }, () => {
      log.debug('Информация о зарегистрированных серверах мониторинга питания обновлена');
    });
  };

  register(null, { ups: new Ups() });
};
