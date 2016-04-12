/**
 * @briskhome/core.bus <lib/core.bus/index.js>
 *
 * Event bus module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

 'use strict';

 module.exports = function setup(options, imports, register) {

   const log = imports.log;

   const Emitter = require('events').EventEmitter;
   const bus = new Emitter();

   log.info('Инициализация модуля общей шины');

   register(null, {
     bus: bus
   });

 };
