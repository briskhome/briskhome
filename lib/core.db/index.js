/**
 * @briskhome/core.db <lib/core.db/index.js>
 *
 * Database configuration module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const config = imports.config('core.db');
  const loader = imports.loader;

  const fs = require('fs');
  const path = require('path');
  const mongoose = require('mongoose');

  const db = mongoose.connect('mongodb://' + config.user + ':' + config.pass + '@' + config.host + '/' + config.name);

  db.connection.on('error', function (err) {
    console.error('Не удалось открыть содинение с базой данных', err);
    register(err);
  });

  db.connection.once('open', function () {
    const models = loader.load('models');
    models.forEach(function (model) {
      try {
        require(model.path)(mongoose);
      } catch (err) {
        //
      }
    });

    register(null, {
      db,
    });
  });
};
