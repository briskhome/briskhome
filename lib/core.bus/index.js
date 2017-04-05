/**
 * @briskhome
 * └core.bus <lib/core.bus/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const Emitter = require('events').EventEmitter;

module.exports = function setup(options, imports, register) {
  const bus = new Emitter();
  const log = imports.log({
    event: 'object'
  });

  log.info('Инициализация модуля общей шины');

  register(null, {
    bus,
  });
};
