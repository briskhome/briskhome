/**
 * @briskhome/core.bus <lib/core.bus/index.js>
 *
 * Модуль общей шины обмена сообщениями.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 */

'use strict';

const Emitter = require('events').EventEmitter;

module.exports = function setup(options, imports, register) {
  const bus = new Emitter();
  const log = imports.log('core.bus', {
    event: 'object',
  });

  log.info('Инициализация модуля общей шины');

  register(null, {
    bus,
  });
};
