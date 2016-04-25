/**
 * @briskhome/core.mqtt <lib/core.mqtt/index.js>
 * └ models/Device.js
 *
 * Internet of Things device database model.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.1.3
 */

'use strict';

module.exports = function (db) {

  const Schema = db.Schema;
  const DeviceSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String },
  }, {
    collection: 'devices',
  });

  return db.model('Device', DeviceSchema);
};
