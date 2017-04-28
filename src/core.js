#!/usr/bin/env node

/** @flow
 * @briskhome
 * └core <lib/core.js>
 */

import os from 'os';
import path from 'path';
import architect from 'architect';
import { enabledComponents } from './components';
import * as briskhome from '../package.json';

const writeBriskhomeLogo = (): void => {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  process.stdout.write(`
     ██████╗ ██████╗ ██╗███████╗██╗  ██╗██╗  ██╗ ██████╗ ███╗   ███╗███████╗
     ██╔══██╗██╔══██╗██║██╔════╝██║ ██╔╝██║  ██║██╔═══██╗████╗ ████║██╔════╝
     ██████╔╝██████╔╝██║███████╗█████╔╝ ███████║██║   ██║██╔████╔██║█████╗
     ██╔══██╗██╔══██╗██║╚════██║██╔═██╗ ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝
     ██████╔╝██║  ██║██║███████║██║  ██╗██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
  \n`);
};

const writeBriskhomeInfo = (): void => {
  process.stdout.write(`{"name":"briskhome","hostname":"${os.hostname()}","pid":${process.pid},"component":"core","level":30,"msg":"Initializing Briskhome v${briskhome.version}","time":"${new Date().toISOString()}","v":0}\n`);
};

process.title = 'briskhome';
writeBriskhomeLogo();
writeBriskhomeInfo();

const components = architect.resolveConfig(enabledComponents(), path.resolve(__dirname));

architect.createApp(components, (err, app) => {
  if (err) {
    throw err;
  }

  const log = app.services.log();
  log.info('Briskhome successfully initialized');

  app.on('error', (error) => {
    log.fatal({ err: error }, err.message);
    setTimeout(process.exit(1), 100);
  });

  process.on('uncaughtException', (uncaughtException: Error) => {
    log.fatal({ err: uncaughtException }, 'Unhandled Exception');
  });

  process.on('SIGINT', () => {
    log.fatal('Application suspended (SIGINT)');
    setTimeout(process.exit(0), 100);
  });
});
