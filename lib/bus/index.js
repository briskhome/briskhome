/**
 * Briskhome - private house monitoring and automation service.
 * -- unified event bus module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

var Emitter = require('events').EventEmitter;

module.exports = function setup(options, imports, register) {

    const bus = new Emitter();

    register(null, {
        bus: bus
    });
};
