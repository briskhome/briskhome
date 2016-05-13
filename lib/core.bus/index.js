/**
 * @briskhome/core.bus <lib/core.bus/index.js>
 *
 * Модуль общей шины обмена сообщениями.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const Emitter = require('events').EventEmitter;
  const bus = new Emitter();

  log.info('Инициализация модуля общей шины');

  register(null, {
    bus: bus,
  });

};
