/** @flow
 * @briskhome
 * └core.db <lib/core.db/index.js>
 */

import mongoose from 'mongoose';
import { requireResources } from '../components';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

module.exports = function setup(options: Object, imports: CoreImports, register: CoreRegister) {
  const { database, hostname, username, password } = imports.config();
  const log = imports.log();

  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${username}:${password}@${hostname}/${database}`);
  mongoose.connection.on('error', (err) => {
    log.fatal({ err }, 'Error establishing connection with the database');
    return register(err);
  });

  mongoose.connection.once('open', () => {
    log.info('Database connection established');
    requireResources('models').every((model) => {
      try {
        require(model).default(mongoose);                                    // eslint-disable-line
      } catch (e) {
        log.fatal({ err: e }, `Error loading database model from ${model}`);
        return register(e);
      }

      return true;
    });

    return register(null, { db: mongoose });
  });
  // }
};
