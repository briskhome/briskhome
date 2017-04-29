/**
 * @briskhome
 * └core.db <lib/core.db/models/LocationModel.js>
 */

export default (db) => {
  const Schema = db.Schema;
  const LocationSchema = new Schema({
    home: { type: String, default: 'default' },
    zone: { type: String, enum: ['indoors', 'outdoors'] },
    room: { type: String, required: true },
  });

  return db.model('core:location', LocationSchema);
};
