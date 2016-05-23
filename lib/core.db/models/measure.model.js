/**
 * @briskhome/core.db <lib/core.db/index.js>
 * └ models/measure.model.js
 *
 * Модель данных измерения датчика.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const MeasureSchema = new Schema({
    value: { type: Number, required: true },
    sensor: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }, {
    collection: 'sensors.measures',
  });

  return db.model('core:measure', MeasureSchema);
};
