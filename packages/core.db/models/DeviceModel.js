/** @flow
 * @briskhome
 * └core.db <models/DeviceModel.js>
 */

import uuid from 'uuid-1345';
import type { CoreImports } from '../../utilities/coreTypes';

export default ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const DeviceSchema = new Schema(
    {
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
    },
    {
      collection: 'devices',
      timestamps: true,
    },
  );

  DeviceSchema.virtual('id').get(function get() {
    return this._id;
  });

  return db.model('core:device', DeviceSchema);
};
