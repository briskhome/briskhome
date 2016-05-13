/**
 * @briskhome/core.loader <lib/core.loader/index.js>
 *
 * Универсальный загрузчик.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const fs = require('fs');
  const path = require('path');

  /**
   * Класс Loader представляет собой универсальный загрузчик. Используется в системных модулях для
   * загрузки маршрутов API, моделей базы данных, конфигурационных файлов. Желательно использовать
   * данный загрузчик при загрузке интерфейсов из других модулей при разработке внешних модулей.
   *
   * @constructor
   */
  function Loader() {

  }

  /**
   * Рекурсивно загружает список файлов, располагающихся в субдиректории с определенным названием,
   * проверяя все директории в директории `lib`.
   *
   * @param {String} subdir  Наименование субдиректории.
   */
  Loader.prototype.load = function load(subdir) {
    let _this = this;
    let results = [];
    const dirs = _this.list(path.resolve('lib'));
    dirs.forEach(function (dir) {
      const subdirs = _this.list(path.resolve('lib', dir));
      if (subdirs.indexOf(subdir) > -1) {
        try {
          const extension = require(path.resolve('lib', dir, 'package.json'));
          const files = fs.readdirSync(path.resolve('lib', dir, subdir));
          files.forEach(function (file) {
            results.push({
              module: extension.name,
              path: path.resolve('lib', dir, subdir, file),
            });
          });
        }
        catch (e) {
          /** Если не удалось загрузить, пропускаем модуль */
        }
      }
    });

    return results;
  };

  /**
   * Загружает список файлов, располагающихся в директории с определенным названием.
   *
   * @param {String} dir  Наименование директории.
   */
  Loader.prototype.list = function list(dir) {
    return fs.readdirSync(dir).filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
  };

  register(null, {
    loader: new Loader(),
  });
};
