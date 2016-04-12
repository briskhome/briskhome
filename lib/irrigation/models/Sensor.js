/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ models/Sensor.js
 *
 * Sensors database model.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const SensorSchema = new Schema({
    name: { type: String, required: true, unique: true },
    alias: { type: String, unique: true },
    module: { type: String, required: true },
    location: { type: String },
    kind: { type: String, required: true },
    value: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  }, {
    collection: 'irrigation.sensors',
  });

  return db.model('Sensor', SensorSchema);
};
