/**
 * @briskhome/core.log <lib/core.log/index.js>
 *
 * Log module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const config = imports.config;

  const logger = require('bristol');

  logger.addTarget('console')
    .withFormatter('human')
    .withLowestSeverity('trace');

  logger.addTarget('file', { file: config.log.path + config.log.file })
    .withFormatter('commonInfoModel')
    .withLowestSeverity('info');

  logger.addTarget('file', { file: './log/debug.log' })
    .withFormatter('commonInfoModel')
    .withHighestSeverity('debug');

  logger.info('Инициализация модуля журналирования');

  register(null, {
    log: logger,
  });

};
