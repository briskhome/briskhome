/**
 * @briskhome/irrigation <lib/irrigation/index.js>
 * └ models/Record.js
 *
 * Модель данных истории полива.
 *
 * @author Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.1.3-rev140416
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const RecordSchema = new Schema({
    circuit: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
  }, {
    collection: 'irrigation.records',
    timestamps: true,
  });

  return db.model('Record', RecordSchema);
};
