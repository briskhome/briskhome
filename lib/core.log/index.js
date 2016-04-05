/**
 * @briskhome/core.log <lib/core.log/index.js>
 *
 * Log module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.2
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const config = imports.config;

  const logger = require('bristol');

  logger.addTarget('console')
    .withFormatter('human');

  logger.addTarget('file', { file: config.log.path + config.log.name })
    .withFormatter('commonInfoModel');

  logger.info('Initialising Briskhome');

  register(null, {
    log: logger,
  });

};
