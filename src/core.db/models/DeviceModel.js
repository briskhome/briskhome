/** @flow
 * @briskhome
 * └core.db <models/DeviceModel.js>
 */

import uuid from 'uuid-1345';
import type { CoreImports, ModelType } from '../../utilities/coreTypes';

export type DeviceType = {
  _id?: string,
  id: string,
  mac: string,
  name: string,
  address: string,
  hostname: string,
  description: string,
  location: string,
  services: Object,

  createdAt?: string,
  updatedAt?: string,
}

export type DeviceModelType = (document: DeviceType) => {

} & DeviceType & ModelType<DeviceModelType>;

export default ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const DeviceSchema = new Schema({
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    mac: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
      unique: true,
    },
    hostname: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      default: null,
    },
    services: { type: Object },
  }, {
    collection: 'devices',
    timestamps: true,
  });

  DeviceSchema.virtual('id').get(function get() {
    return this._id;
  });

  return db.model('core:device', DeviceSchema);
};
