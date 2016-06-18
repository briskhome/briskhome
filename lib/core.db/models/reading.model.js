/**
 * @briskhome/core.db <lib/core.db/index.js>
 * └ models/reading.model.js
 *
 * Модель показателя сенсора, подключенного к сети BRISKHOME.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const ReadingSchema = new Schema({
    sensor: { type: String, ref: 'core:sensor' },
    values: [{
      _id: false,
      value: { type: Number },
      timestamp: { type: Date, default: Date.now },
    }],
    timestamp: { type: Date, default: new Date().setUTCHours(0, 0, 0, 0) },
  }, {
    collection: 'readings',
  });

  return db.model('core:reading', ReadingSchema);
};
