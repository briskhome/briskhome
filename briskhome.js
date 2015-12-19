/**
 * Briskhome - private house monitoring and automation service.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.0
 */

'use strict';

var log = require('bristol');
var moment = require('moment');
var sysmon = require('briskhome-sysmon');

/* Logger library configuration */

const LOG_DIR = './';
const LOG_FILE = 'briskhome.log';

log.addTarget('console')
  .withFormatter('human');
log.addTarget('file', {file: LOG_DIR + LOG_FILE})
  .withFormatter('syslog');
log.info('Logger library loaded, logging to ' + LOG_DIR + LOG_FILE);

/* Database library configuration */

var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://10.29.0.10/test');

db.on('error', function(err) {
  log.error('Unable to connect to MongoDB.', err);
});
db.once('open', function() {
  log.info('Connected to MongoDB instance at 10.29.0.10');
});
