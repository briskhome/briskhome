/**
 * @briskhome/core.config <lib/config/index.js>
 *
 * Configuration module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

// const CONFIG_FILE = '/opt/briskhome/briskhome.conf';
// const CONFIG_DATA = {
//   comments: [';', '#'],
//   path: true,
//   sections: true,
//   separators: '=',
//   strict: true
// };

module.exports = function setup(options, imports, register) {

  const parse = require('properties').parse;
  const config = require('config-node')({
    dir: 'etc',
    env: process.env.NODE_ENV,
    ext: 'conf',
    conf: function(code) {
      return parse(code, {
        sections: true,
        comments: [';', '#'],
        separators: '=',
        strict: true,
        namespaces: true,
      });
    },
  });

  register(null, {
    config: config,
  });

};
