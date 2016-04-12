'use strict';

module.exports = function (server, imports) {

  const log = imports.log;
  const irrigation = imports.irrigation;

  const passport = require('passport-restify');

  // /**
  //  * Example route declaration.
  //  */
  // server.get({
  //   path: '/irrigation',
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
    path: '/irrigation/circuits',
    version: '2.0.0',
  },
  passport.authenticate('localapikey', {
    session: false,
    failureRedirect: '/unauthorized',
  }),
  function (req, res, next) {
    irrigation.circuits(function (err, data) {
      if (err) {
        log.error(err);
        return next(err);
      }

      var message = {
        status: {
          code: 200,
          message: 'OK',
        },
        data: [],
      };
      let i = data.length;
      while (i--) {
        let circuit = data[i];
        log.info(circuit);
        message.data.push(circuit);
      }

      res.send(message);
    });

    return next();
  });

  /**
   *
   */
  server.get({
    path: '/irrigation/circuits/:name',
    version: '2.0.0',
  },
  passport.authenticate('localapikey', {
    session: false,
    failureRedirect: '/unauthorized',
  }),
  function (req, res, next) {
    irrigation.circuits(req.params.name, function (err, data) {
      if (err) {
        log.error(err);
        return next(err);
      }

      var message = {
        status: {
          code: 200,
          message: 'OK',
        },
        data: [],
      };
      let circuit = data[0];
      message.data = circuit;
      res.send(message);
    });

    return next();
  });

  /**
   *
   */
  server.put({
    path: '/irrigation/circuits/:name',
    version: '2.0.0',
  },
  passport.authenticate('localapikey', {
    session: false,
    failureRedirect: '/unauthorized',
  }),
  function (req, res, next) {
    if ('action' in req.body) {
      if (req.body.action === 'start') {
        let humidity = req.body.options.humidity ? req.body.options.humidity : null;
        let period = req.body.options.period ? req.body.options.period : null;
        log.info(req.params.name, req.body.humidity, req.body.period);
        irrigation.circuits(req.params.name, function (err, data) {
          if (err) {
            log.error(err);
            return next(err);
          }

          log.debug(data);
          let circuit = data[0].name;
          irrigation.start(circuit, { humidity: humidity, period: period });
          res.send(200, { status: { code: 200, message: 'OK' } });
        });
      }

      if (req.body.action === 'stop') {
        irrigation.circuits(req.params.name, function (err, data) {
          if (err) {
            log.error(err);
            return next(err);
          }

          log.info(data);
          let circuit = data[0].name;
          irrigation.stop(circuit);
          res.send(200, { status: { code: 200, message: 'OK' } });
        });
      }
    } else {
      res.send(400, { status: { code: 400, message: 'Bad request' } });
    }
  });
};
