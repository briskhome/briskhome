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
const briskhome = require('./package.json');
const components = require('./lib/index.js').enabledComponents();

writeBriskhomeLogo();
writeBriskhomeInfo();

const modules = architect.resolveConfig(components, path.resolve(__dirname, 'lib'));

architect.createApp(modules, (err, app) => {
  if (err) {
    throw err;
  }

  const log = app.services.log('core');
  log.info('Initialization successful');

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

function writeBriskhomeLogo() {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  process.stdout.write(`
     ██████╗ ██████╗ ██╗███████╗██╗  ██╗██╗  ██╗ ██████╗ ███╗   ███╗███████╗
     ██╔══██╗██╔══██╗██║██╔════╝██║ ██╔╝██║  ██║██╔═══██╗████╗ ████║██╔════╝
     ██████╔╝██████╔╝██║███████╗█████╔╝ ███████║██║   ██║██╔████╔██║█████╗
     ██╔══██╗██╔══██╗██║╚════██║██╔═██╗ ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝
     ██████╔╝██║  ██║██║███████║██║  ██╗██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
  `);
}

function writeBriskhomeInfo() {
  process.stdout.write(`\n{"name":"briskhome","hostname":"${os.hostname()}","pid":${process.pid},"component":"core","level":30,"msg":"Initializing Briskhome v${briskhome.version}","time":"${new Date().toISOString()}","v":0}\n`);
}
