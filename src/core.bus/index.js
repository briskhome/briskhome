/**
 * @briskhome
 * └core.bus <lib/core.bus/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

import EventEmitter from 'eventemitter2';

export default (options, imports, register) => {
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
