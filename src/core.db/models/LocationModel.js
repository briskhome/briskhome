/** @flow
 * @briskhome
 * └core.db <models/LocationModel.js>
 */

import uuid from 'uuid-1345';
import type { CoreImports, ModelType } from '../../utilities/coreTypes';

export type RoomType = {
  id: string,
  name: string,
  description: string,
}

export type ZoneType = {
  id: string,
  name: string,
  description: string,
  rooms: Array<RoomType>,
}

export type LocationType = {
  id: string,
  name: string,
  description: string,
  geo: {
    latitude: string,
    longtitude: string,
    radius: string,
  },
  zones: Array<ZoneType>,
}

export type LocationModelType = (document: LocationType) => {

} & LocationType & ModelType<LocationModelType>

export default ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const RoomSchema = new Schema({
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    name: String,
    description: String,
  });

  const ZoneSchema = new Schema({
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    name: String,
    description: String,
    rooms: [RoomSchema],
  });

  const LocationSchema = new Schema({
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    name: String,
    description: String,
    geo: {
      latitude: String,
      longtitude: String,
      radius: String,
    },
    zones: [ZoneSchema],
  });

  return db.model('core:location', LocationSchema);
};
