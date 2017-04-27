/**
 * @briskhome
 * └core.log <lib/core.log/index.js>
 */

const bunyan = require('bunyan');

module.exports = function setup(options, imports, register) {
  const config = imports.config();
  const log = bunyan.createLogger({
    name: 'briskhome',
    streams: [{
      level: config.level,
      stream: process.stdout,
    }],
  });

  register(null, {
    log: () => {
      // XXX: Potential bottleneck: getting the callee from stack trace.
      const child = log.child({
        component: String(new Error().stack.split('\n')[2].split('/').slice(-2, -1)),
      });
      child.info('Initializing component');
      return child;
    },
  });
};
