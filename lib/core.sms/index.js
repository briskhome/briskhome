/**
 * @briskhome/core.sms <lib/core.sms/index.js>
 *
 * Short Message Service client for Smsaero API.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const config = imports.config;
  const log = imports.log;

  const http = require('http');

  function Sms() {
    log.info('Инициализация модуля коротких сообщений');
    this.user = config.sms.user;
    this.password = config.sms.password;
  }

  Sms.prototype.send = function send(recipient, message) {
    const _this = this;

    if (message.length > 70) {
      message = message.substring(0, 70);
    }

    let query = `http://gate.smsaero.ru/balance/?user=${_this.user}&password=${_this.password}&answer=json`;
    http.get(query, function (res) {
      res.on('data', function (data) {
        data = JSON.parse(data.toString());
        let balance = data.balance;
        if (Number(balance) < 1.8) {
          log.error('Баланс лицевого счета не позволяет отправить сообщение', {
            'Адресат': recipient,
            'Текст сообщения': message,
            'Баланс': balance + ' руб.',
          });
        } else {
          let query = `http://gate.smsaero.ru/send/?user=${_this.user}&password=${_this.password}&to=${recipient}&text=${encodeURIComponent(message)}&from=BRISKHOME&answer=json`;z
          http.get(query, function (res) {
            res.on('data', function (data) {
              data = data.toString();
              if (data.indexOf('accepted') > 0) {
                log.debug('Отправлено SMS-сообщение', {
                  'Адресат': recipient,
                  'Текст сообщения': message,
                  'Баланс': balance + ' руб.',
                });
              } else {
                log.error('Не удалось отправить SMS-сообщение', {
                  'Адресат': recipient,
                  'Текст сообщения': message,
                  'Баланс': balance + ' руб.',
                  'Ответ сервера': data,
                });
              }
            });
          }).on('error', function (err) {
            log.error('Не удалось отправить SMS-сообщение', err);
          });
        }
      });
    });
  };

  register(null, {
    sms: new Sms(),
  });

};
