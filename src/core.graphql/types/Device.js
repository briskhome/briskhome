/** @flow
 * @briskhome
 * └core.graphql <types/Device.js>
 */

import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import SensorType from './Sensor';
import type { CoreImports } from '../../utilities/coreTypes';

export default (imports: CoreImports): GraphQLObjectType => {
  const { dataloader, db } = imports;
  const SensorModel = db.model('core:sensor');
  const Sensor = SensorType(imports);
  return new GraphQLObjectType({
    name: 'Device',
    description: 'This is a generic device',
    fields: {
      id: {
        type: GraphQLString,
        description: 'Unique device identifier',
      },
      name: {
        type: GraphQLString,
        description: 'Human-readable device name',
      },
      sensors: {
        type: new GraphQLList(Sensor),
        description: 'Sensors that are connected to or operated by this device',
        resolve: async (src) => {
          const ids = await SensorModel.sensorsByDeviceId(src.id);
          if (!ids.length) return null;
          return dataloader.sensorById.loadMany(ids.reduce((acc, doc) => acc.concat(doc._id), []));
        },
      },
    },
  });
};