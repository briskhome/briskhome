/**
 * @briskhome/core.db <lib/core.db/index.js>
 *
 * Database configuration module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

// TODO v0.1.3
//  [ ] Scan for database models in other modules' directories

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const config = imports.config.get('db');

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
    const dirs = getDirs(path.resolve('lib'));
    dirs.forEach(function (dir) {
      const subdirs = getDirs(path.resolve('lib', dir));
      const plugin = require(path.resolve(`lib/${dir}/package.json`));
      if (subdirs.indexOf('models') > -1) {
        const files = fs.readdirSync(path.resolve(`lib/${dir}/models`));
        files.forEach(function (file) {
          require(path.resolve(`lib/${dir}/models/${file}`))(mongoose);
          log.debug(`Загружена модель ${file.slice(0, -3)} из модуля ${plugin.name}`);
        });
      }
    });

    register(null, {
      db: mongoose,
    });
  });

  function getDirs(dir) {
    return fs.readdirSync(dir).filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
  }
};
