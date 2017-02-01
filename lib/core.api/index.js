/**
 * @briskhome/core.api <lib/core.api/index.js>
 *
 * Application programming interface for web access module.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (options, imports, register) {

  const config = imports.config('core.api');
  const db = imports.db;
  const log = imports.log('core.api');
  const loader = imports.loader;

  const fs = require('fs');
  const path = require('path');
  const semver = require('semver');

  const Token = db.models['сore:token'];

  /* Restify */

  const restify = require('restify');
  const server = restify.createServer({
    name: 'Briskhome API',
    version: ['3.0.0'],
  });

  server.use(restify.queryParser());
  server.use(restify.bodyParser({ mapParams: true }));

  /* Authentication */

  const passport = require('passport-restify');
  const HeaderTokenStrategy = require('passport-http-header-token').Strategy;
  const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;
  imports.passport = passport;

  server.use(passport.initialize());
  passport.use(new HeaderTokenStrategy(
    function (apikey, done) {
      log.info('Получен запрос с маркером аутентификации \'' + apikey + '\'');
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
    log.error(error);
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

  server.listen(8081, 'localhost', function () {
    log.info('Инициализация сервера API');
    log.debug('Инициализация маршрутов');

    const routes = loader.load('routes');
    routes.forEach(function (route) {
      try {
        require(route.path)(server, imports);
        log.debug('Загружены маршруты из модуля', route.module);
      } catch (err) {
        log.warn('Не удалось загрузить маршруты модуля', route, err);
      }
    });

    log.debug('Загружено маршрутов:', routes.length);
  });

  /**/

  server.get('/unauthorized', function (req, res, next) {
    res.send(401, { status: { code: 401, message: 'Unauthorized' } });
  });

  register(null, {
    api: server,
  });
};
