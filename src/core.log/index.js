/** @flow
 * @briskhome
 * └core.log <index.js>
 */

import bunyan from 'bunyan';
import { getCallee, normalizeName } from '../utilities/helpers';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const log = bunyan.createLogger({
    name: 'briskhome',
    streams: [{
      level: options.level,
      stream: process.stdout,
    }],
  });

  register(null, {
    log: (name?: string) => {
      const child = log.child({
        component: name || normalizeName(getCallee()),
      });
      child.debug('Initialized logger instance for component');
      return child;
    },
  });
};
