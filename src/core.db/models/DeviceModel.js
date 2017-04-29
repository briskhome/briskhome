/**
 * @briskhome
 * └core.db <lib/core.db/models/DeviceModel.js>
 */

const uuid = require('uuid-1345');

export default (db) => {
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
