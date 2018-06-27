#!/usr/bin/env node
// @flow

/**
 * @briskhome/core
 *  <index.js>
 */

// $FlowFixMe
import Architect from './lib/architect';
import * as briskhome from './package.json';
import { briskhomeAsciiLogo } from '../utilities/constants';
import { dump, write } from './utils';
// $FlowFixMe
import { MODULE_EXTENSIONS } from './lib/constants';

process.on('unhandledRejection', err => dump(err));

(async () => {
  const app = await Architect.create();
  app.on('error', err => write(err));
  try {
    await app.load(MODULE_EXTENSIONS);
  } catch (err) {
    return dump(err);
  }

  const bus = app.get(MODULE_EXTENSIONS, 'core.bus');
  const log = app.get(MODULE_EXTENSIONS, 'core.log')('core');

  log.info('Briskhome initialization successful');
  bus.emit('core:ready', app);

  if (process.argv.includes('--stop')) {
    process.exit(0);
  }

  bus.on('core:error', (err: Error) => dump(err));
})();

if (!process.argv.includes('--ugly')) {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  process.stdout.write(briskhomeAsciiLogo);
  process.title = 'briskhome';
}

write(`Initializing Briskhome v${briskhome.version}`);
