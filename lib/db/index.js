/**
 * Briskhome - private house monitoring and automation service.
 * Database configuration file & connection manager library.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const DB_URL = 'mongodb://10.29.0.10/test';
const DB_USER = '';
const DB_PASS = '';

var mongoose = require('mongoose');
var connection = mongoose.createConnection(DB_URL);

mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + DB_URL);
});
mongoose.connection.on('error', function(err) {
  log.error('Unable to connect to MongoDB.', err);
});
mongoose.connection.once('open', function() {
  log.info('Connected to MongoDB instance at 10.29.0.10');
});

// -process.on('SIGINT', function() {
//   mongoose.connection.close(function() {
//     console.log('Mongoose disconnected. Reason: app termination');
//     process.exit(0);
//   });
// });

module.exports.mongoose = mongoose;
module.exports.connection = connection;
