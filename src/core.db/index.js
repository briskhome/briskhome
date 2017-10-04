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
  const { database, hostname, username, password } = options;
  const bus = imports.bus;
  const log = imports.log();

  let ready = false;
  bus.on('core:ready', () => (ready = true));

  let credentials = '';
  if (username)
    credentials = password ? `${username}:${password}@` : `${username}@`;

  mongoose.Promise = global.Promise;
  mongoose.set('debug', options.NODE_ENV !== 'production');
  mongoose.connect(`mongodb://${credentials}${hostname}/${database}`);
  mongoose.connection.on('error', err => {
    log.fatal(
      { err, hostname, database, username },
      'Error establishing connection to MongoDB instance',
    );
    if (ready) bus.emit('core:error', err);
    return register(err);
  });

  mongoose.connection.on('connecting', () => {
    log.debug(
      { hostname, database, username, password },
      'Trying to connect to MongoDB instance',
    );
  });

  mongoose.connection.once('connected', () => {
    log.info(
      { hostname, database, username },
      'Database connection established',
    );
    resources('models', [{ ...imports, db: mongoose }]);
    return register(null, { db: mongoose });
  });

  mongoose.connection.on('disconnecting', () => {
    log.debug(
      { hostname, database, username },
      'Disconnecting from MongoDB instance',
    );
  });

  mongoose.connection.on('disconnected', () => {
    log.warn(
      { hostname, database, username },
      'Disconnected from MongoDB instance',
    );
  });

  mongoose.connection.on('reconnected', () => {
    log.info(
      { hostname, database, username },
      'Reconnected to MongoDB instance',
    );
  });
};
