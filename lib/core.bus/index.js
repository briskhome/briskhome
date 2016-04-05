/**
 * @briskhome/core.bus <lib/core.bus/index.js>
 *
 * Event bus module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.2
 */

 'use strict';

 module.exports = function setup(options, imports, register) {

   const Emitter = require('events').EventEmitter;
   const bus = new Emitter();

   register(null, {
     bus: bus
   });

 };
