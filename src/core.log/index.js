/** @flow
 * @briskhome
 * └core.log <lib/core.log/index.js>
 */

import bunyan from 'bunyan';
import { getCallee } from '../utilities/helpers';
import type { CoreImports, CoreRegister } from '../types/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const log = bunyan.createLogger({
    name: 'briskhome',
    streams: [{
      level: options.level,
      stream: process.stdout,
    }],
  });

  register(null, {
    log: () => {
      const child = log.child({
        component: getCallee(),
      });
      child.debug('Initialized logger instance for component');
      return child;
    },
  });
};
