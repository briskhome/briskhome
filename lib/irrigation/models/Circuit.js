/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ models/Circuit.js
 *
 * Irrigation circuit database model.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const CircuitSchema = new Schema({
    name: { type: String, required: true, unique: true },
    pin: { type: Number, required: true, unique: true },
    flow: { type: Number, max: 10, default: 10 },
    humidity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
  }, {
    collection: 'irrigation.circuits',
  });

  return db.model('Circuit', CircuitSchema);
};
