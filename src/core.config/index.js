/**
 * @briskhome
 * └core.config <lib/core.config/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const path = require('path');
const nconf = require('nconf');
const properties = require('properties');

module.exports = function setup(options, imports, register) {
  const loader = imports.loader;

  const parse = dir => properties.parse(dir, {
    comments: '#',
    separators: '=',
    sections: true,
    namespaces: true,
    variables: true,
  });

  const stringify = dir => properties.stringify(dir, {
    comment: '#',
    separator: '=',
    unicode: true,
  });

  /** Загрузчик переменных среды */
  nconf.env();

  const NODE_ENV = nconf.get('NODE_ENV') || 'briskhome';

  /** Загрузчик основной конфигурации приложения */
  nconf.use('briskhome', {
    type: 'file',
    file: path.resolve('etc', `${NODE_ENV}.conf`),
    format: {
      parse,
      stringify,
    },
  });

  /** Загрузчик конфигурации внешних модулей */
  const configs = loader.load('etc');
  for (let i = 0; i < configs.length; i += 1) {
    nconf.use(configs[i].module, {
      type: 'file',
      file: configs[i].path,
      format: {
        parse,
        stringify,
      },
    });
  }

  register(null, { config: () => {
    return nconf.get(`${new Error().stack.split('\n')[2].split('/').slice(-2, -1)}`.replace('.', ':'));
  }
  });
};