/**
 * @briskhome/core.planner <lib/core.planner/index.js>
 *
 * Компонент планировщика задач.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const Agenda = require('agenda');

export default (options, imports, register) => {
  const log = imports.log();
  const config = imports.config();

  const agenda = new Agenda({
    db: {
      address: `mongodb://${config.username}:${config.password}@${config.hostname}/${config.database}`,
      collection: 'jobs'
    }
  });

  // agenda.define('irrigation.start', function (job, done) {
  //   log.debug('Задача irrigation.start');
  //
  //   done();
  // });

  agenda.on('start', function (job) {
    console.log('Job %s starting', job.attrs.name);
  });

  agenda.on('error', function (err) {
    console.log(err);
    register(err);
  });

  agenda.on('ready', function () {
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
