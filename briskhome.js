/**
 * Briskhome - private house monitoring and automation service.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.1
 */

'use strict';

// TODO Each internal module should accept an object with several unified
//      utils, such as log (currently global), database and eventEmitter.

global.db = require('./lib/db');
global.log = require('./lib/log');

// Temporarily commented out:
// global.emitter = require('briskhome-events');

var certificate = require('./lib/pki');
var cert = certificate.create();

var sysmon = require('briskhome-sysmon');

// System monitor configuration
sysmon.start({
  delay: 600,
});
sysmon.on('start', function(event) {
  log.info(event, 'briskhome-sysmon started');
});
sysmon.on('event', function(event) {
  log.info(event);
});
