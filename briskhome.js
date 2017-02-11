#!/usr/bin/env node

/**
 * Briskhome - private house monitoring and automation service.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

process.stdout.write('\u001b[2J\u001b[0;0H');                 // eslint-disable-next-line no-console
console.log(`[${new Date().toISOString()}]  INIT: briskkhome/${process.pid}`);

const path = require('path');
const architect = require('architect');

const modules = architect.loadConfig(path.join(__dirname, './lib/index.js'));
architect.createApp(modules, (err, app) => {
  if (err) {
    throw err;
  }

  const log = app.services.log('core');

  log.info('Инициализация системных компонентов завершена');

  app.on('error', (appErr) => {
    log.fatal({ err: appErr });
    setTimeout(process.exit(1), 100);
  });

  process.on('uncaughtException', (processErr) => {
    console.log(processErr);
    console.log(processErr.stack);
    log.fatal({ err: processErr }, 'При работе приложения произошло необработанное исключение');
    setTimeout(process.exit(1), 100);
  });

  process.on('SIGINT', () => {
    log.fatal('Приложение завершило работу (SIGINT)');
    setTimeout(process.exit(0), 100);
  });
});
