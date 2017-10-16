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

process.on('unhandledRejection', err => dump(err));

(async () => {
  let app;
  try {
    const plugins = await resolveConfig(
      enabledPlugins(),
      path.resolve(__dirname, '..'),
    );
    app = await new Architect().loadPlugins(plugins);
  } catch (err) {
    return dump(err);
  }

  const bus = app.services.bus;
  const log = app.services.log('core');
  log.info('Briskhome initialization successful');
  bus.emit('core:ready', app);

  if (process.argv.includes('--stop')) {
    process.exit(0);
  }

  bus.on('core:error', (err: Error) => dump(err));
})();

if (!process.argv.includes('--ugly')) {
  writeBriskhomeLogo();
  writeBriskhomeInfo();
}

function writeBriskhomeLogo(): void {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  process.stdout.write(briskhomeAsciiLogo);
}

function writeBriskhomeInfo(): void {
  process.title = 'briskhome';
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
}

function dump(err: Error): void {
  process.stdout.write(`{
    "name":"briskhome",
    "hostname":"${os.hostname()}",
    "pid":${process.pid},
    "component":"core",
    "level":60,
    "msg":"${err.toString()}",
    "time":"${new Date().toISOString()}",
    "v":0
  }\n`);
  process.stderr.write(err.stack);
  process.stderr.write('\n');
  process.exit(1);
}
