/** @flow
 * @briskhome
 * └core.db <lib/core.db/models/DeviceModel.js>
 */

import uuid from 'uuid-1345';
import type mongoose from 'mongoose';
import type { ModelType } from '../../utilities/coreTypes';

export type DeviceType = {
  _id?: string,
  id: string,
  mac: string,
  name: string,
  address: string,
  hostname: string,
  description: string,
  location: Object,
  services: Object,

  createdAt?: string,
  updatedAt?: string,
}

export type DeviceModelType = (document: DeviceType) => {

} & DeviceType & ModelType<DeviceModelType>;

export default (db: mongoose) => {
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
