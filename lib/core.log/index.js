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
  const config = imports.config();
  const log = bunyan.createLogger({
    name: 'briskhome',
    level: config.level,
    stream: process.stdout,
  });

  register(null, {
    log: (schema) => {
      // XXX: Potential bottleneck: getting the callee from stack trace.
      const name = `${new Error().stack.split('\n')[2].split('/').slice(-2, -1)}`;
      const child = log.child({
        stream: require('bunyan-mongodb-stream')({
          model: db.model('core:log').discriminator(name, new db.Schema(schema, {
            discriminatorKey: 'component'
          }))
        }),
        component: name
      });
      child.info('Initializing component');
      return child;
    }
  });
};
