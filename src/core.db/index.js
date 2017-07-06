/** @flow
 * @briskhome
 * └core.db <lib/core.db/index.js>
 */

import mongoose from 'mongoose';
import { resources } from '../utilities/resources';
import type { CoreImports, CoreRegister } from '../types/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const { database, hostname, username, password } = options;
  const credentials = password ? `${username}:${password}@` : `${username}@` || '';
  const log = imports.log();

  mongoose.Promise = global.Promise;
  mongoose.set('debug', true);
  mongoose.connect(`mongodb://${credentials}${hostname}/${database}`);
  mongoose.connection.on('error', (err) => {
    log.fatal({ err, hostname, database, username }, 'Error establishing connection to MongoDB instance');
    return register(err);
  });

  mongoose.connection.on('connecting', () => {
    log.debug({ hostname, database, username, password }, 'Trying to connect to MongoDB instance');
  });

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }


  mongoose.connection.once('connected', () => {
    log.info({ hostname, database, username }, 'Database connection established');
    resources('models', [{ ...imports, db: mongoose }]);

    const ReadingModel = mongoose.model('core:reading');
    ReadingModel.upsertReading('28.F2FBE3467CC2', { type: 'temperature', value: getRandomIntInclusive(0, 100) });

    return register(null, { db: mongoose });
  });

  mongoose.connection.on('disconnecting', () => {
    log.debug({ hostname, database, username }, 'Disconnecting from MongoDB instance');
  });

  mongoose.connection.on('disconnected', () => {
    log.warn({ hostname, database, username }, 'Disconnected from MongoDB instance');
  });

  mongoose.connection.on('reconnected', () => {
    log.info({ hostname, database, username }, 'Reconnected to MongoDB instance');
  });
};
