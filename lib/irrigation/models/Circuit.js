/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ models/Circuit.js
 *
 * Модель данных контура полива.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.1.3-rev140416
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const CircuitSchema = new Schema({
    name: { type: String, required: true, unique: true },
    status: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    sensors: {
      level: { type: Number },
      moisture: { type: Number },
      humidity: { type: Number },
      temperature: { type: Number },
    },
  }, {
    collection: 'irrigation.circuits',
  });

  return db.model('Circuit', CircuitSchema);
};
