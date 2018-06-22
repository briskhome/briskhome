/** @flow
 * @briskhome
 * └core.log <index.js>
 */

import bunyan from 'bunyan';
import { getCallee, normalizeName } from '../utilities/helpers';
import type { CoreOptions, CoreImports } from '../utilities/coreTypes';

export default (options: CoreOptions, imports: CoreImports) => {
  const log = bunyan.createLogger({
    name: 'briskhome',
    streams: [
      {
        level: options.level || 10,
        stream: process.stdout,
      },
    ],
  });

  return (name?: string) => {
    const child = log.child({
      component: name || normalizeName(getCallee()),
    });
    child.debug('Initialized logger instance for component');
    return child;
  };
};
