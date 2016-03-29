/**
 * Briskhome - private house monitoring and automation service.
 * -- database configuration file & connection manager library.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log;

  const DB_URL = 'mongodb://10.29.0.10/test';
  const DB_USER = '';
  const DB_PASS = '';

  const mongoose = require('mongoose');
  const connection = null;
  // const connection = mongoose.createConnection(DB_URL);

  log.info('DB INIT');

  mongoose.connection.on('connected', function() {
    log.info('Mongoose default connection open to ' + DB_URL);
  });
  mongoose.connection.on('error', function(err) {
    log.info('Unable to connect to MongoDB.', err);
  });
  mongoose.connection.once('open', function() {
    log.info('Connected to MongoDB instance at 10.29.0.10');
  });

  register(null, {
    db: connection,
  });

};
