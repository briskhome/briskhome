#!/usr/bin/env node

/** @flow
 * @briskhome
 * └core <lib/core.js>
 */

import os from 'os';
import path from 'path';
import * as briskhome from '../package.json';
import Architect, { resolveConfig } from './utilities/architect';
import { enabledPlugins } from './utilities/plugins';
import { briskhomeAsciiLogo } from './utilities/constants';

(async () => {
  console.time('briskhome/architect');
  let app;
  let plugins;
  try {
    plugins = await resolveConfig([
      { main: '/opt/briskhome/lib/core.bus', hey: 'ho', lets: 'go' },
      '/opt/briskhome/lib/core.config',
      '/opt/briskhome/lib/core.db',
      '/opt/briskhome/lib/core.graphql',
      { main: '/opt/briskhome/lib/core.loader', hey: 'rest' },
      '/opt/briskhome/lib/core.log',
      '/opt/briskhome/lib/core.notifications',
      '/opt/briskhome/lib/core.utils',
    ], path.resolve(__dirname, '..'));
    app = await new Architect().loadPlugins(plugins);
  } catch (e) {
    process.stdout.write(`{"name":"briskhome","hostname":"${os.hostname()}","pid":${process.pid},"component":"core","level":60,"msg":"${e.toString()}","time":"${new Date().toISOString()}","v":0}\n`);
    process.stderr.write(e.toString());
    process.exit();
  }

  console.timeEnd('briskhome/architect');
  // TODO: Subscribe to commands via hub to enable or disable plugins.
})();
const writeBriskhomeLogo = (): void => {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  process.stdout.write(briskhomeAsciiLogo);
};

const writeBriskhomeInfo = (): void => {
  process.stdout.write(`{"name":"briskhome","hostname":"${os.hostname()}","pid":${process.pid},"component":"core","level":30,"msg":"Initializing Briskhome v${briskhome.version}","time":"${new Date().toISOString()}","v":0}\n`);
  process.title = 'briskhome';
};

// TODO: Need a better name
if (!process.argv.includes('--ugly')) {
  writeBriskhomeLogo();
  writeBriskhomeInfo();
}

