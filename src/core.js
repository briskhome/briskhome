#!/usr/bin/env node

/** @flow
 * @briskhome
 * └core <core.js>
 */

import os from 'os';
import path from 'path';
import * as briskhome from '../package.json';
import Architect, { resolveConfig } from './utilities/architect';
import { enabledPlugins } from './utilities/plugins';
import { briskhomeAsciiLogo } from './utilities/constants';

(async () => {
  let app;
  try {
    const plugins = await resolveConfig(enabledPlugins(), path.resolve(__dirname, '..'));
    app = await new Architect().loadPlugins(plugins);
  } catch (e) {
    process.stdout.write(`{
      "name":"briskhome",
      "hostname":"${os.hostname()}",
      "pid":${process.pid},
      "component":"core",
      "level":60,
      "msg":"${e.toString()}",
      "time":"${new Date().toISOString()}",
      "v":0
    }\n`);
    process.stderr.write(e.stack);
    process.stderr.write('\n');
    process.exit(1);
    return;
  }

  const bus = app.services.bus;
  const log = app.services.log('core');
  log.info('Briskhome initialization successful');
  bus.emit('core:ready');

  process.on('unhandledRejection', (err, promise) => {
    log.error({ err, promise }, 'unhandledRejection');
    process.exit(1);
  });
})();

const writeBriskhomeLogo = (): void => {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  process.stdout.write(briskhomeAsciiLogo);
};

const writeBriskhomeInfo = (): void => {
  process.stdout.write(`{
    "name":"briskhome",
    "hostname":"${os.hostname()}",
    "pid":${process.pid},
    "component":"core",
    "level":30,
    "msg":"Initializing Briskhome v${briskhome.version}",
    "time":"${new Date().toISOString()}",
    "v":0
  }\n`);
  process.title = 'briskhome';
};

if (!process.argv.includes('--ugly')) {
  writeBriskhomeLogo();
  writeBriskhomeInfo();
}

process.on('unhandledRejection', (e, promise) => {
  // process.stdout.write(`{
  //   "name":"briskhome",
  //   "hostname":"${os.hostname()}",
  //   "pid":${process.pid},
  //   "component":"core",
  //   "level":60,
  //   "msg":"${e.toString()}",
  //   "time":"${new Date().toISOString()}",
  //   "v":0
  // }\n`);
  console.error(promise);
  console.error(e);
  process.exit(1);
});
