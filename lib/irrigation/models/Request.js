/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ models/Request.js
 *
 * Irrigation request database model.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const RequestSchema = new Schema({
    body: { type: String, required: true, unique: true },
    response: { type: String },
    timestamp: { type: Date, default: Date.now },
  }, {
    collection: 'irrigation.requests',
  });

  return db.model('Request', RequestSchema);
};
