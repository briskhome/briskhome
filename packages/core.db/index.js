/** @flow
 * @briskhome
 * └core.db <index.js>
 */

import mongoose from 'mongoose';
import { resources } from '../utilities/resources';
import type {
  CoreOptions,
  CoreImports,
  CoreRegister,
} from '../utilities/coreTypes';

export default (
  options: CoreOptions,
  imports: CoreImports,
  register: CoreRegister,
) => {
  const { uri } = options;
  const bus = imports.bus;
  const log = imports.log();

  let ready = false;
  bus.on('core:ready', () => (ready = true));

  mongoose.Promise = Promise;
  mongoose.connect(uri, {
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE,
    keepAlive: 120,
  });

  mongoose.connection.on('error', err => {
    log.fatal(
      { err, uri },
      'Error establishing connection to MongoDB instance',
    );
    if (ready) bus.emit('core:error', err);
    return register(err);
  });

  mongoose.connection.on('connecting', () => {
    log.debug({ uri }, 'Trying to connect to MongoDB instance');
  });

  mongoose.connection.once('connected', () => {
    log.info({ uri }, 'Database connection established');
    resources('models', [{ ...imports, db: mongoose }]);
    return register(null, { db: mongoose });
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
};
