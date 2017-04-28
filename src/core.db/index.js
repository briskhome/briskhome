/**
 * @briskhome
 * └core.db <lib/core.db/index.js>
 */

const mongoose = require('mongoose');

module.exports = function setup(options, imports, register) {
  const { database, hostname, username, password } = imports.config();
  const log = imports.log();
  const loader = imports.loader;

  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${username}:${password}@${hostname}/${database}`);
  mongoose.connection.on('error', (err) => {
    log.fatal({ err }, 'Error establishing connection with the database');
    return register(err);
  });

  mongoose.connection.once('open', () => {
    log.info('Database connection established');
    const models = loader.load('models');
    for (let i = 0; i < models.length; i += 1) {
      try {
        require(models[i].path)(mongoose);                                    // eslint-disable-line
      } catch (err) {
        log.fatal({ err }, `Error loading database model ${models[i].name} from ${models[i].path}`);
        return register(err);
      }
    }

    return register(null, { db: mongoose });
  });
  // }
};
