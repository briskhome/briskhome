/**
 * @briskhome
 * └core.db <lib/core.db/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const mongoose = require('mongoose');

module.exports = function setup(options, imports, register) {
  const config = imports.config('core.db');
  const loader = imports.loader;

  const db = mongoose.connect(`mongodb://${config.user}:${config.pass}@${config.host}/${config.name}`);

  db.connection.on('error', (err) => {
    register(err);
  });

  db.connection.once('open', () => {
    const models = loader.load('models');
    for (let i = 0; i < models.length; i += 1) {
      try {
        require(models[i].path)(mongoose);                                    // eslint-disable-line
      } catch (err) {
        register(err);
      }
    }

    register(null, { db });
  });
};
