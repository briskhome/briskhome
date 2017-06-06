/** @flow
 * @briskhome
 * └core.db <lib/core.db/index.js>
 */

import mongoose from 'mongoose';
import { resources } from '../resources';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

module.exports = function setup(options: Object, imports: CoreImports, register: CoreRegister) {
  const { database, hostname, username, password } = imports.config();
  const credentials = password ? `${username}:${password}` : username || '';
  const log = imports.log();

  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${credentials}@${hostname}/${database}`);
  mongoose.connection.on('error', (err) => {
    log.fatal({ err, hostname, database, username }, 'Error establishing connection to MongoDB instance');
    return register(err);
  });

  mongoose.connection.on('connecting', () => {
    log.trace({ hostname, database, username, password }, 'Trying to connect to MongoDB instance');
  });

  mongoose.connection.once('connected', () => {
    log.info({ hostname, database, username }, 'Database connection established');
    resources('models', [mongoose]);

    return register(null, { db: mongoose });
  });

  mongoose.connection.on('disconnecting', () => {
    log.trace({ hostname, database, username }, 'Disconnecting from MongoDB instance');
  });

  mongoose.connection.on('disconnected', () => {
    log.debug({ hostname, database, username }, 'Disconnected from MongoDB instance');
  });

  mongoose.connection.on('reconnected', () => {
    log.info({ hostname, database, username }, 'Reconnected to MongoDB instance');
  });
};
