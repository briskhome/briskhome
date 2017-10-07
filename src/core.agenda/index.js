/** @flow
 * @briskhome
 * └core.agenda <index.js>
 */

import Agenda from 'agenda';
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

  agenda.on('start', job => {
    log.debug({ job: job.attrs.name }, 'Starting job');
    log.trace({ job });
  });

  agenda.on('error', err => {
    return register(err);
  });

  agenda.on('ready', () => {
    agenda.every('1 minute', 'com.briskhome.job.poll');
    bus.on('core:ready', () => agenda.start());
    return register(null, { agenda });
  });
};
