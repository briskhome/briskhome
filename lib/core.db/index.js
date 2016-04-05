/**
 * @briskhome/core.db <lib/core.db/index.js>
 *
 * Database configuration module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.2
 */


'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const config = imports.config;

  const mongoose = require(config.log.mock || 'mongoose');

  mongoose.connect(config.db.host);

  mongoose.connection.on('connected', function() {
    log.info('Initializing database connection.',
  {
    status: 'open',
    host: config.db.host,
  });
  });

  mongoose.connection.on('error', function(err) {
    log.info('Unable to open database connection.', err);
    register(err);
  });

  mongoose.connection.once('open', function() {
    register(null, {
      db: mongoose,
    });
  });

};
