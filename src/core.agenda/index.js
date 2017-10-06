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

  // agenda.define('irrigation.start', function (job, done) {
  //   log.debug('Задача irrigation.start');
  //
  //   done();
  // });

  agenda.on('start', (/* job */) => {
    // console.log('Job %s starting', job.attrs.name);
  });

  agenda.on('error', err => {
    return register(err);
  });

  agenda.on('ready', () => {
    agenda.every('1 minute', 'com.briskhome.job.poll');
    return register(null, { agenda });
  });

  agenda.on('start', job => {
    log.debug({ job: job.attrs.name }, `Starting job`);
    log.trace({ job });
  });
};
