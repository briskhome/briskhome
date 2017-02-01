/**
 * @briskhome/core.db <lib/core.db/index.js>
 * └ models/device.model.js
 *
 * Модель устройства, подключенного к сети BRISKHOME.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (db) {

  const uuid = require('uuid-1345');

  const Schema = db.Schema;
  const DeviceSchema = new Schema({
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    mac: { type: String },
    name: { type: String },
    address: { type: String, unique: true },
    hostname: { type: String },
    description: { type: String },
    location: {},
    services: { type: Object },
  }, {
    collection: 'devices',
    timestamps: true,
  });

  return db.model('core:device', DeviceSchema);
};
