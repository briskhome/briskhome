/**
 * @briskhome
 * └core.db <lib/core.db/models/ReadingeModel.js>
 */

import type mongoose from 'mongoose';
import type { ModelType } from '../../utilities/coreTypes';

export type ReadingType = {
  sensor: string,
  values: Array<{
    temperature: number,
    timestamp: string,
  }>,
  timestamp: string,
}

export type ReadingModelType = (document: ModelType) => {

} & ReadingType & ModelType<ReadingModelType>

export default (db: mongoose) => {
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
