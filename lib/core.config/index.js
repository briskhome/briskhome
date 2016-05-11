/**
 * @briskhome/core.config <lib/config/index.js>
 *
 * Configuration module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

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
