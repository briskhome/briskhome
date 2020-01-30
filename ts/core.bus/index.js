/** @flow
 * @briskhome
 * └core.bus <index.js>
 */
import EventEmitter from 'eventemitter2';
import { CoreImports } from "../utilities/coreTypes";
export default ((imports: CoreImports) => {
  const log = imports.core.log();
  const bus = new EventEmitter({
    delimiter: ':',
    newListener: false,
    verboseMemoryLeak: true,
    wildcard: true
  });
  bus.on('broadcast:**', function coreEvent(...data) {
    log.trace({
      event: this.event
    }, data);
  });
  bus.on('core:**', function coreEvent(...data) {
    log.trace({
      event: this.event
    }, data);
  });
  return bus;
});