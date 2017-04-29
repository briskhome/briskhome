/**
 * @briskhome
 * └core.db <lib/core.db/models/ReadingeModel.js>
 */

export default (db) => {
  const Schema = db.Schema;
  const ReadingSchema = new Schema({
    sensor: { type: String, ref: 'core:sensor' },
    values: [{
      _id: false,
      temperature: { type: Number },
      timestamp: { type: Date, default: Date.now },
    }],
    timestamp: { type: Date, default: new Date().setUTCHours(0, 0, 0, 0) },
  }, {
    collection: 'readings',
  });

  return db.model('core:reading', ReadingSchema);
};
