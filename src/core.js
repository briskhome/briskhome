#!/usr/bin/env node

/**
 * @briskhome
 * └core <lib/core.js>
 */

const os = require('os');
const path = require('path');
const architect = require('architect');
const briskhome = require('../package.json');
const components = require('./components').enabledComponents();

process.title = 'briskhome';

function writeBriskhomeLogo() {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  process.stdout.write(`
     ██████╗ ██████╗ ██╗███████╗██╗  ██╗██╗  ██╗ ██████╗ ███╗   ███╗███████╗
     ██╔══██╗██╔══██╗██║██╔════╝██║ ██╔╝██║  ██║██╔═══██╗████╗ ████║██╔════╝
     ██████╔╝██████╔╝██║███████╗█████╔╝ ███████║██║   ██║██╔████╔██║█████╗
     ██╔══██╗██╔══██╗██║╚════██║██╔═██╗ ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝
     ██████╔╝██║  ██║██║███████║██║  ██╗██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
  \n`);
}

function writeBriskhomeInfo() {
  process.stdout.write(`{"name":"briskhome","hostname":"${os.hostname()}","pid":${process.pid},"component":"core","level":30,"msg":"Initializing Briskhome v${briskhome.version}","time":"${new Date().toISOString()}","v":0}\n`);
}

writeBriskhomeLogo();
writeBriskhomeInfo();

const modules = architect.resolveConfig(components, path.resolve(__dirname));

architect.createApp(modules, (err, app) => {
  if (err) {
    throw err;
  }

  const log = app.services.log();
  log.info('Initialization successful');

  app.on('error', (error) => {
    log.fatal({ err: error }, err.message);
    setTimeout(process.exit(1), 100);
  });

  process.on('uncaughtException', (uncaughtException) => {
    log.fatal({ err: uncaughtException }, 'Unhandled Exception');
  });

  process.on('SIGINT', () => {
    log.fatal('Application suspended (SIGINT)');
    setTimeout(process.exit(0), 100);
  });
});
