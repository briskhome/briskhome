/** @flow
 * @briskhome
 * └core.agenda <index.js>
 */
import Agenda from 'agenda';
import { CoreImports } from "../utilities/coreTypes";
export default ((imports: CoreImports): Agenda => {
  const {
    core: {
      bus
    }
  } = imports;
  const log = imports.core.log();
  const agenda = new Agenda({
    db: {
      collection: 'jobs'
    },
    mongo: imports.core.db.connections[0]
  });
  agenda.define('com.briskhome.job.poll', function (job, done) {
    bus.emit('broadcast:poll');
    return done();
  });
  return new Promise((resolve, reject) => {
    agenda.on('start', job => {
      log.debug({
        job: job.attrs.name
      }, 'Starting job');
      log.trace({
        job
      });
    });
    agenda.on('error', err => {
      return reject(err);
    });
    agenda.on('ready', () => {
      agenda.every('1 minute', 'com.briskhome.job.poll');
      bus.on('core:ready', () => agenda.start());
      return resolve(agenda);
    });
  });
});