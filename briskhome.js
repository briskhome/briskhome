#!/usr/bin/env node

/**
 * Briskhome - private house monitoring and automation service.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.2
 */

'use strict';

/* Core modules. */
const path = require('path');

/* Briskhome modules. */
const architect = require('architect');
const optimist = require('optimist');

/* Other dependencies. */

// TODO The following constant is a candidate for renaming.
const modules = architect.loadConfig(path.join(__dirname, "./lib/index.js"));
architect.createApp(modules, function(err, app) {
  if (err) {
    throw err;
  }
  console.log(app);
});

// // // // // // // // // // // // // // // // // // // // // // // // // // //
//
// const CONFIG_FILE = '/opt/briskhome/briskhome.conf';
// const CONFIG_DATA = {
//   comments: [';', '#'],
//   path: true,
//   sections: true,
//   separators: '=',
//   strict: true
// };
//
// const configurator = require('properties');
// configurator.parse(CONFIG_FILE, CONFIG_DATA, function (err, conf) {
//   if (err) { console.error(err.name, err.message); throw err; }
//   global.config = conf;
//   global.log    = require('./lib/log');
//   global.db     = require('./lib/db');
// });
//
//
// // Temporarily commented out:
// // global.emitter = require('briskhome-events');
//
// // var certificate = require('./lib/pki');
// // var cert = certificate.create();
// // console.log(cert);
//
//
//

/**
 * Error and exception handling, pre-restart clean-up.
 */
process.on('uncaughtException', function(err) {
  console.error('An uncaught exception occured during the execution of Briskhome.');
  console.log(err.stack);
  process.exit(1);
});

process.on('SIGINT', function() {
  console.log(' <-- The application will now quit (SIGINT).');
  // db.connection.close(function() {
  //   // log.info('Database connection closed. Will now exit.');
  // });
  process.exit(0);
});
