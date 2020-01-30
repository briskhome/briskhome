/** @flow
 * @briskhome
 * └core.db <index.js>
 */

import mongoose from 'mongoose';
import type { CoreOptions, CoreImports } from '../utilities/coreTypes';

export default (imports: CoreImports, options: CoreOptions): any => {
  const { uri } = options;
  const {
    core: { app, bus },
  } = imports;
  const log = imports.core.log();

  let ready = false;
  bus.on('core:ready', () => (ready = true));

  mongoose.Promise = Promise;
  mongoose.connect(
    uri,
    {
      useMongoClient: true,
      reconnectTries: Number.MAX_VALUE,
      keepAlive: 120,
    },
  );

  return new Promise((resolve, reject) => {
    mongoose.connection.on('error', err => {
      log.fatal(
        { err, uri },
        'Error establishing connection to MongoDB instance',
      );
      if (ready) bus.emit('core:error', err);
      return reject(err);
    });

    mongoose.connection.on('connecting', () => {
      log.debug({ uri }, 'Trying to connect to MongoDB instance');
    });

    mongoose.connection.once('connected', async () => {
      log.info({ uri }, 'Database connection established');
      await app.load('briskhome:db:model', { args: [{ db: mongoose }] });
      return resolve(mongoose);
    });

    mongoose.connection.on('disconnecting', () => {
      log.debug({ uri }, 'Disconnecting from MongoDB instance');
    });

    mongoose.connection.on('disconnected', () => {
      log.warn({ uri }, 'Disconnected from MongoDB instance');
    });

    mongoose.connection.on('reconnected', () => {
      log.info({ uri }, 'Reconnected to MongoDB instance');
    });
  });
};
