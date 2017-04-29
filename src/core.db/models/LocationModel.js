/** @flow
 * @briskhome
 * └core.db <lib/core.db/models/LocationModel.js>
 */

import type mongoose from 'mongoose';
import type { ModelType } from '../../utilities/coreTypes';

export type LocationType = {
  home: string,
  zone: string,
  room: string,
}

export type LocationModelType = (document: LocationType) => {

} & LocationType & ModelType<LocationModelType>

export default (db: mongoose) => {
  const Schema = db.Schema;
  const LocationSchema = new Schema({
    home: { type: String, default: 'default' },
    zone: { type: String, enum: ['indoors', 'outdoors'] },
    room: { type: String, required: true },
  });

  return db.model('core:location', LocationSchema);
};
