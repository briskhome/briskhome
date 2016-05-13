/**
 * @briskhome/core.db <lib/core.db/index.js>
 *
 * Database configuration module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

// TODO v0.1.3
//  [ ] Scan for database models in other modules' directories

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const config = imports.config.get('db');
  const loader = imports.loader;

  const fs = require('fs');
  const path = require('path');
  const mongoose = require('mongoose');

  mongoose.connect(config.host);

  mongoose.connection.on('error', function (err) {
    log.info('Не удалось открыть содинение с базой данных', err);
    register(err);
  });

  mongoose.connection.once('open', function () {
    log.info('Инициализация модуля базы данных', {
      'Статус': 'соединение установлено',
      'Адрес': config.host,
    });

    log.debug('Инициализация моделей данных');

    const models = loader.load('models');
    models.forEach(function (model) {
      try {
        require(model.path)(mongoose);
      } catch (err) {
        console.error('Не удалось загрузить модель данных', model);
      }
    });

    register(null, {
      db: mongoose,
    });
  });
};
