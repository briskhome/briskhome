/**
 * @briskhome/core.db <lib/core.db/index.js>
 * └ models/sensor.model.js
 *
 * Модель данных датчика.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const SensorSchema = new Schema({
    name: { type: String, required: true, unique: true },
    module: { type: String, required: true },
    location: { type: String },
    kind: { type: String, required: true },
    value: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  }, {
    collection: 'sensors',
  });

  return db.model('core:sensor', SensorSchema);
};
