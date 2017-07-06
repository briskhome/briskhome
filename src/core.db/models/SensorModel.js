/** @flow
 * @briskhome
 * └core.db <lib/core.db/models/SensorModel.js>
 */

import uuid from 'uuid-1345';
import type { CoreImports, ModelType } from '../types/coreTypes';

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

export default ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const SensorSchema = new Schema({
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    device: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    values: [{
      type: String,
    }],
    bounds: [{
      _id: false,
      type: { type: String },
      operation: { type: String },
      value: { type: String },
    }],
    location: {
      type: String,
      default: null,
    },
  }, {
    collection: 'sensors',
    timestamps: true,
  });

  SensorSchema.methods.setOnline = async function setOnline(state: boolean)
    : Promise<SensorType> {
    this.isOnline = state;
    return this.save();
  };

  SensorSchema.statics.sensorById = async function fetchBySerial(id: string)
    : Promise<SensorType> {
    return this.findOne({ _id: id }).exec();
  };

  SensorSchema.statics.sensorsByDeviceId = async function fetchBySerial(deviceId: string)
    : Promise<Array<SensorType>> {
    return this.find({ device: deviceId }).exec();
  };

  SensorSchema.virtual('id').get(function () {
    return this._id;
  });

  return db.model('core:sensor', SensorSchema);
};
