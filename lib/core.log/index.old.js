/**
 * @briskhome/core.log <lib/core.log/index.js>
 *
 * Log module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const config = imports.config.get('log');

  const logger = require('bristol');

  logger.addTarget('console')
    .withFormatter('human')
    .withLowestSeverity('trace');

  logger.addTarget('file', { file: config.path + config.file })
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