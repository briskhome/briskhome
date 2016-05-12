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

  const config = imports.config.get('api');
  const db = imports.db;
  const log = imports.log;

  const fs = require('fs');
  const path = require('path');
  const semver = require('semver');

  const Token = db.models['сore:Token'];

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
  const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;

  server.use(passport.initialize());
  passport.use(new LocalAPIKeyStrategy(
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

  server.listen(8081, '10.29.0.12', function () {
    log.info('Инициализация сервера API');

    log.debug('Инициализация маршрутов');
    const dirs = getDirs(path.resolve('lib'));
    dirs.forEach(function (dir) {
      const subdirs = getDirs(path.resolve('lib', dir));
      const plugin = require(path.resolve(`lib/${dir}/package.json`));
      if (subdirs.indexOf('routes') > -1) {
        const files = fs.readdirSync(path.resolve(`lib/${dir}/routes`));
        files.forEach(function (file) {
          require(path.resolve(`lib/${dir}/routes/${file}`))(server, imports);
          log.debug(`Загружены маршруты из модуля ${plugin.name}`);
        });
      }
    });
  });

  /**/

  server.get('/unauthorized', function (req, res, next) {
    res.send(401, { status: { code: 401, message: 'Unauthorized' } });
  });

  /**/

  function getDirs(dir) {
    return fs.readdirSync(dir).filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
  }

  register(null, {
    api: server,
  });
};
