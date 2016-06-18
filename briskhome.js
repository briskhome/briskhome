#!/usr/bin/env node

/**
 * Briskhome - private house monitoring and automation service.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

/* Clearing the terminal and setting the cursor to 0,0 */
process.stdout.write('\u001b[2J\u001b[0;0H');
console.log('[' + new Date().toISOString() + ']  INIT: briskhome/' + process.pid);

/* Core modules. */
const path = require('path');

/* Briskhome modules. */
const architect = require('architect');

/* Other dependencies. */
const modules = architect.loadConfig(path.join(__dirname, './lib/index.js'));
architect.createApp(modules, function (err, app) {
  if (err) {
    throw err;
  }

  const log = app.services.log('core');
  log.info('Инициализация системных модулей завершена');

  app.on('error', function (err) {
    log.fatal(err);
    setTimeout(function () {
      process.exit(1);
    }, 100);
  });

  /**
   * Error and exception handling, pre-restart clean-up.
   */
  process.on('uncaughtException', function (err) {
    log.fatal({data: err}, 'При работе приложения произошло необработанное исключение');
    setTimeout(function () {
      process.exit(1);
    }, 100);
  });

  process.on('SIGINT', function () {
    log.fatal('Приложение завершило работу (SIGINT)');

    // db.connection.close(function() {
    //   // log.info('Database connection closed. Will now exit.');
    // });
    setTimeout(function () {
      process.exit(0);
    }, 100);
  });

});
