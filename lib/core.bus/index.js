/**
 * @briskhome/core.bus <lib/core.bus/index.js>
 *
 * Модуль общей шины обмена сообщениями.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (options, imports, register) {

  const Emitter = require('events').EventEmitter;
  const bus = new Emitter();
  const log = imports.log('core.bus', {
    event: 'object',
  });

  log.info('Инициализация модуля общей шины');

  register(null, {
    bus: bus,
  });

};
