'use strict';

module.exports = function (server, imports) {

  const log = imports.log;

  const passport = require('passport-restify');
  const MjpegProxy = require('mjpeg-proxy').MjpegProxy;

  // /**
  //  * Example route declaration.
  //  */
  // server.get({
  //   path: '/',
  //   version: '2.0.0',
  // },
  // passport.authenticate('localapikey', { session: false, failureRedirect: '/unauthorized' }),
  // function (req, res, next) {
  //
  // });

  /**
   *
   */
  server.get({
    path: '/cameras',
    version: '2.0.0',
  },
  passport.authenticate('localapikey', { session: false, failureRedirect: '/unauthorized' }),
  function (req, res, next) {

  });

  /**
   *
   */
  server.get({
    path: '/cameras/:id',
    version: '2.0.0',
  },
  passport.authenticate('localapikey', { session: false, failureRedirect: '/unauthorized' }),
  function (req, res, next) {
    new MjpegProxy('http://admin:admin@192.168.1.1' + req.params.id + '/cgi/mjpg/mjpg.cgi').proxyRequest;
  });
};
