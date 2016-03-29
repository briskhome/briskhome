/**
 * Briskhome - private house monitoring and automation service.
 * -- multitarget logger bridge configuration file.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const LOG_DIR = './';
  const LOG_FILE = 'briskhome.log';

  const logger = require('bristol');

  logger.addTarget('console')
    .withFormatter('human');

  logger.addTarget('file', {file: LOG_DIR + LOG_FILE})
    .withFormatter('human');

  logger.info('We\'re up and running!');

  register(null, {
    log: logger,
  });

};
