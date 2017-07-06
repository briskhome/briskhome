/** @flow
 * @briskhome
 * └core.graphql <lib/core.graphql/index.js>
 */

import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import SensorType from './Sensor';
import type { CoreGraphQL, CoreImports } from '../../types/coreTypes';

export default ({ dataloader, db, log }: CoreImports): CoreGraphQL => {
  const SensorModel = db.model('core:sensor');
  const Sensor = SensorType({ dataloader, db, log });
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
