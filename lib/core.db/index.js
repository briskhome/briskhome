/**
 * @briskhome/core.db <lib/core.db/index.js>
 *
 * Database configuration module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

module.exports = function setup(options, imports, register) {
  const config = imports.config('core.db');
  const loader = imports.loader;

  const db = mongoose.connect(`mongodb://${config.user}:${config.pass}@${config.host}/${config.name}`);

  db.connection.on('error', (err) => {
    console.error('Не удалось открыть содинение с базой данных', err);
    register(err);
  });

  db.connection.once('open', () => {
    console.log('Инициализация компонента базы данных');
    console.log(db);
    const models = loader.load('models');
    models.forEach((model) => {
      try {
        require(model.path)(mongoose);
      } catch (err) {
        //
        console.error(err);
      }
    });

    register(null, {
      db,
    });
  });
};
