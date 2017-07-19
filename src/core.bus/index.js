/** @flow
 * @briskhome
 * └core.bus <index.js>
 */

import EventEmitter from 'eventemitter2';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const log = imports.log();
  const bus = new EventEmitter({
    delimiter: ':',
    newListener: false,
    verboseMemoryLeak: true,
    wildcard: true,
  });

  bus.on('broadcast:**', function coreEvent(...data) {                                            // eslint-disable-line
    log.trace({ event: this.event }, data);
  });

  bus.on('core:**', function coreEvent(...data) {                                                 // eslint-disable-line
    log.trace({ event: this.event }, data);
  });

  bus.on('core:ready', () => {
    setInterval(() => {
      bus.emit('broadcast:poll');
    }, options.interval);
  });

  register(null, { bus });
};
