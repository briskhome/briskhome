/**
 * Briskhome - private house monitoring and automation service.
 * Database configuration file & connection manager library.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const LOG_DIR = './';
const LOG_FILE = 'briskhome.log';

var logger = require('bristol');

logger.addTarget('console')
  .withFormatter('human');

logger.addTarget('file', {file: LOG_DIR + LOG_FILE})
  .withFormatter('json');

module.exports = function() {
  return logger;
};
