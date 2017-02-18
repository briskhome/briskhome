/**
 * @briskhome
 * └core.log <lib/core.log/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const bunyan = require('bunyan');

module.exports = function setup(options, imports, register) {
  const db = imports.db;
  const config = imports.config('core.log');
  const log = bunyan.createLogger({
    name: 'briskhome',
    level: config.level,
    stream: process.stdout,
  });

  register(null, {
    log: (name, schema) => log.child({
      stream: require('bunyan-mongodb-stream')({
        model: db.model('core:log').discriminator(name, new db.Schema(schema, {
          discriminatorKey: 'module',
          /** @todo  module => component */
        })),
      }),
    }),
  });
};
