/**
 * @briskhome/core.api <lib/core.api/index.js>
 *
 * Application programming interface for web access module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function (options, imports, register) {

  const config = imports.config;
  const db = imports.db;
  const log = imports.log;

  const fs = require('fs');
  const path = require('path');
  const semver = require('semver');

  /* Models */

  const Token = db.models.Token;

  /* Restify */

  const restify = require('restify');
  const server = restify.createServer({
    name: 'Briskhome API',
    version: ['2.0.0'],
  });

  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  /* Authentication */

  const passport = require('passport-restify');
  const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;

  server.use(passport.initialize());
  passport.use(new LocalAPIKeyStrategy(
    function (apikey, done) {
      log.info(apikey);
      Token.findOne({ access_token: apikey }).lean().exec(function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      });
    }
  ));

  /* Event handlers */

  server.on('NotFound', function (req, res, cb) {
    res.send(404, { status: { code: 404, message: 'Not Found' } });
  });

  server.on('MethodNotAllowed', function (req, res, cb) {
    res.send(405, { status: { code: 405, message: 'Method Not Allowed' } });
  });

  server.on('uncaughtException', function (req, res, route, error) {
    // log.error(req, res, route, cb);
    res.send(error);
  });

  server.on('after', function (req, res, route, err) {
    // log the request
  });

  server.pre(function (req, res, next) {
    let pieces = req.url.replace(/^\/+/, '').split('/');
    let version = pieces[0];

    if (!semver.valid(version)) {
      version = version.replace(/v(\d{1})/, '$1.0.0');
    }

    if (semver.valid(version) && server.versions.indexOf(version) > -1) {
      req.url = req.url.replace(pieces[0] + '/', '');
      req.headers['accept-version'] = version;
    }

    return next();
  });

  server.listen(8081, '10.29.0.12', function () {
    log.info('Инициализация сервера API');
    require('./routes')(server, imports);
  });

  /**/


  server.get('/unauthorized', function (req, res, next) {
    res.send(401, { status: { code: 401, message: 'Unauthorized' } });
  });

  /**/

  register(null, {
    api: server,
  });
};
