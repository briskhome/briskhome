/** @flow
 * @briskhome
 * └core.log <lib/core.log/index.js>
 */

import bunyan from 'bunyan';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

module.exports = function setup(options: Object, imports: CoreImports, register: CoreRegister) {
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
      const child = log.child({
        component: String(new Error().stack.split('\n')[2].split('/').slice(-2, -1)),
      });
      child.debug('Initialized logger instance for component');
      return child;
    },
  });
};
