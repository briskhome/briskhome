/**
* @briskhome/irrigation <lib/irrigation/index.js>
* └ routes/index.js
*
* API routes for greenhouse watering and climate control module.
*
* @author Egor Zaitsev <ezaitsev@briskhome.com>
* @version 0.1.2
*/

'use strict';

module.exports = function(controller, imports) {

  const api = imports.api;
  const log = imports.log;

  api.get('/irrigation/circuits/:name', function(req, res, next) {

    res.send('{message: resource not yet implemented}');
    return next();
  });

};
