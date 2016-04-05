/**
 * @briskhome/core.api <lib/core.api/index.js>
 *
 * Application programming interface for web access module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.2
 */

'use strict';

module.exports = function(options, imports, register) {

  const config = imports.config;
  const db = imports.db;
  const log = imports.log;

  const restify = require('restify');
  const server = restify.createServer({
    name: require('./package.json').name,
    version: require('./package.json').version,
  });

  server.listen(8081, '10.29.0.12', function() {
    log.info('Initializing API server', {
      name: server.name,
      url: server.url
    });
  });

  register(null, {
    api: server
  });
};
