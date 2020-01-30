/** @flow
 * @briskhome
 * â””core.log <index.js>
 */
import bunyan from 'bunyan';
import { getCallee, normalizeName } from "../../utilities/helpers";
const log = bunyan.createLogger({
  name: 'briskhome',
  streams: [{
    level: process.env.BRISKHOME_LOG_LEVEL || 10,
    stream: process.stdout
  }]
});
export default ((name?: string) => {
  const child = log.child({
    component: name || normalizeName(getCallee())
  });
  child.debug('Initialized logger instance for component');
  return child;
});