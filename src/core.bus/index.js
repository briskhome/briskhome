/**
 * @briskhome
 * └core.bus <lib/core.bus/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

const Emitter = require('events').EventEmitter;
const util = require('util');

export default (options, imports, register) => {
  imports.log();

  function Bus() {}

  util.inherits(Bus, Emitter);

  register(null, { bus: new Bus() });
};
