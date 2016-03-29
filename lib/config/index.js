/**
 * @briskhome/core.config <lib/config/index.js>
 *
 * Configuration plugin.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.0
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

  const conf = require('properties').parse;
  const config = require('config-node')({
    dir: 'lib/config',
    env: process.env.NODE_ENV || 'briskhome',
    ext: 'conf',
    conf: conf,
  });

  //imports.log(config);

  register(null, {
    config: config,
  });
};
