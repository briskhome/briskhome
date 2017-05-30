/** @flow
 * @briskhome
 * └core.db <lib/core.db/models/SensorModel.js>
 */

import uuid from 'uuid-1345';
import type mongoose from 'mongoose';
import type { ModelType } from '../../types/coreTypes';

export type SensorType = {
  _id?: string,
  id: string,
  serial: string,
  device: string,
  isOnline: boolean,
  values: string,
  lcoation: Object,
}

export type SensorModelType = {
  setOnline: (state: boolean) => SensorModelType
} & SensorType & ModelType<SensorModelType>

export default (db: mongoose) => {
  const Schema = db.Schema;
  const SensorSchema = new Schema({
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    device: {
      type: String,
      required: false,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    values: [{
      type: String,
      enum: [
        'distance',
        'humidity',
        'moisture',
        'pressure',
        'temperature',
      ],
    }],
    location: { type: Schema.Types.Mixed },
  }, {
    collection: 'sensors',
    timestamps: true,
  });

  SensorSchema.methods.setOnline = async function setOnline(state: boolean)
    : Promise<SensorType> {
    this.isOnline = state;
    return this.save(); // ?
  };

  SensorSchema.statics.fetchBySerial = async function fetchBySerial(serial: string)
    : Promise<SensorType> {
    return this.findOne({ _id: serial }).exec();
  };

  return db.model('core:sensor', SensorSchema);
};
