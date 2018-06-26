/** @flow
 * @briskhome
 * └core.agenda <index.js>
 */

import Agenda from 'agenda';
import type { CoreOptions, CoreImports } from '../utilities/coreTypes';

export default (imports: CoreImports, options: CoreOptions) => {
  const { bus } = imports;
  const log = imports.log();
  const agenda = new Agenda({
    db: { collection: 'jobs' },
    mongo: imports.db.connections[0],
  });

  agenda.define('com.briskhome.job.poll', function(job, done) {
    bus.emit('broadcast:poll');
    return done();
  });

  return new Promise((resolve, reject) => {
    agenda.on('start', job => {
      log.debug({ job: job.attrs.name }, 'Starting job');
      log.trace({ job });
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
};
