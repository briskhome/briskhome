/**
 * @briskhome/core.planner <lib/core.planner/index.js>
 *
 * Компонент планировщика задач.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const Agenda = require('agenda');

module.exports = function setup(options, imports, register) {
  const log = imports.log('core.planner');
  const config = imports.config('core.planner');

  const agenda = new Agenda({
    db: {
      address: `mongodb://${config.user}:${config.pass}@${config.host}/${config.name}`,
      collection: 'jobs',
    },
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
