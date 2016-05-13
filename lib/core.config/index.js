/**
 * @briskhome/core.config <lib/config/index.js>
 *
 * Конфигурационный модуль.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const fs = require('fs');
  const path = require('path');
  const nconf = require('nconf');
  const properties = require('properties');

  const loader = imports.loader;

  const parse = function (path) {
    return properties.parse(path, {
      comments: '#',
      separators: '=',
      sections: true,
      namespaces: true,
      variables: true,
    });
  };

  const stringify = function (path) {
    return properties.stringify(path, {
      comment: '#',
      separator: '=',
      unicode: true,
    });
  };

  /** Загрузчик переменных среды */
  nconf.env();

  const NODE_ENV = nconf.get('NODE_ENV') || 'briskhome';

  /** Загрузчик основной конфигурации приложения */
  nconf.use('briskhome', {
    type: 'file',
    file: path.resolve('etc', NODE_ENV + '.conf'),
    format: {
      parse,
      stringify,
    },
  });

  /** Загрузчик конфигурации внешних модулей */
  const configs = loader.load('etc');
  configs.forEach(function (config) {
    nconf.use(config.module, {
      type: 'file',
      file: config.path,
      format: {
        parse,
        stringify,
      },
    });
  });

  register(null, {
    config: nconf,
  });
};
