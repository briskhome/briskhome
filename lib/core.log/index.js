/**
 * @briskhome/core.log <lib/core.log/index.js>
 *
 * Модуль журналирования.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const db = imports.db;
  const config = imports.config('core.log');
  const bunyan = require('bunyan');
  const log = bunyan.createLogger({
    name: 'briskhome',
    level: config.level,
    stream: process.stdout,
  });

  register(null, {
    log: function (name, schema) {
      return log.child({
        stream: require('bunyan-mongodb-stream')({
          model: db.model('core:log').discriminator(name, new db.Schema(schema, {
            discriminatorKey: 'module',
          })),
        }),
      });
    },
  });
};
