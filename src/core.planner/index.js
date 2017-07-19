/**
 * @briskhome/core.planner <lib/core.planner/index.js>
 *
 * Компонент планировщика задач.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

const Agenda = require('agenda');

export default (options, imports, register) => {
  const log = imports.log();

  const agenda = new Agenda({
    db: {
      address: `mongodb://${options.username}:${options.password}@${options.hostname}/${options.database}`,
      collection: 'jobs',
    },
  });

  // agenda.define('irrigation.start', function (job, done) {
  //   log.debug('Задача irrigation.start');
  //
  //   done();
  // });

  agenda.on('start', (/* job */) => {
    // console.log('Job %s starting', job.attrs.name);
  });

  agenda.on('error', (err) => {
    // console.log(err);
    register(err);
  });

  agenda.on('ready', () => {
    log.info('Инициализация планировщика задач');

    // agenda.now('irrigation.start', function (job) {
    //   log.debug('Запуск задачи', { data: job });
    // });
    //
    // agenda.every('5 seconds', 'irrigation.start');

    agenda.start();
    // console.log(agenda);
    register(null, { planner: agenda });
  });
};
