/**
 * @briskhome/core.db <lib/core.db/index.js>
 * └ models/location.model.js
 *
 * Модель данных локации.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const LocationSchema = new Schema({
    home: { type: String, default: 'default' },
    zone: { type: String, enum: ['indoors', 'outdoors'] },
    room: { type: String, required: true },
  });

  return db.model('core:allocation', LocationSchema);
};
