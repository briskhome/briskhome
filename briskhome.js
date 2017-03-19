#!/usr/bin/env node

/**
 * Briskhome – a work-in-progress open-source house monitoring and automation system.
 *
 * @author  Egor Zaitsev <ezaitsev@briskhome.com>
 * @license MIT
 */

'use strict';

const os = require('os');
const path = require('path');
const architect = require('architect');

printLogo();
printInit();

const components = require('./lib/index.js').enabledComponents();

// XXX: The following definition is used in development only & needs to be removed prior to release.
const modules = process.env.NODE_ENV === 'development'
  ? architect.loadConfig(path.resolve(__dirname, './lib/index.json'))
  : architect.loadConfig(components);

architect.createApp(modules, (err, app) => {
  if (err) {
    throw err;
  }

  const log = app.services.log('core');
  log.info('Initialization complete');

  app.on('error', (error) => {
    log.fatal({ err: error }, err.message);
    setTimeout(process.exit(1), 100);
  });

  process.on('uncaughtException', (uncaughtException) => {
    log.fatal({ err: uncaughtException }, 'Unhandled Exception');
    setTimeout(process.exit(1), 100);
  });

  process.on('SIGINT', () => {
    log.fatal('Application suspended (SIGINT)');
    setTimeout(process.exit(0), 100);
  });
});

function printLogo() {
  process.stdout.write('\u001b[2J\u001b[0;0H');                          // eslint-disable-next-line
  console.log(`
     ██████╗ ██████╗ ██╗███████╗██╗  ██╗██╗  ██╗ ██████╗ ███╗   ███╗███████╗
     ██╔══██╗██╔══██╗██║██╔════╝██║ ██╔╝██║  ██║██╔═══██╗████╗ ████║██╔════╝
     ██████╔╝██████╔╝██║███████╗█████╔╝ ███████║██║   ██║██╔████╔██║█████╗
     ██╔══██╗██╔══██╗██║╚════██║██╔═██╗ ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝
     ██████╔╝██║  ██║██║███████║██║  ██╗██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
  `);
}

function printInit() {                                                   // eslint-disable-next-line
  console.log(`{"name":"briskhome","hostname":"${os.hostname()}","pid":${process.pid},"component":"core","level":30,"msg":"Initializing Briskhome v${require('./package.json').version}","time":"${new Date().toISOString()}","v":0}`);
}
