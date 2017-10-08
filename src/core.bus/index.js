/** @flow
 * @briskhome
 * └core.bus <index.js>
 */

import EventEmitter from 'eventemitter2';
import type {
  CoreOptions,
  CoreImports,
  CoreRegister,
} from '../utilities/coreTypes';

export default (
  options: CoreOptions,
  imports: CoreImports,
  register: CoreRegister,
) => {
  const log = imports.log();
  const bus = new EventEmitter({
    delimiter: ':',
    newListener: false,
    verboseMemoryLeak: true,
    wildcard: true,
  });

  bus.on('broadcast:**', function coreEvent(...data) {
    log.trace({ event: this.event }, data);
  });

  bus.on('core:**', function coreEvent(...data) {
    log.trace({ event: this.event }, data);
  });

  register(null, { bus });
};
