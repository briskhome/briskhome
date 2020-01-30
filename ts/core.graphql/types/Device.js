/** @flow
 * @briskhome
 * └core.graphql <types/Device.js>
 */
import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
import SensorType from "./Sensor";
export default new GraphQLObjectType({
  name: 'Device',
  description: 'This is a generic device',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique device identifier'
    },
    name: {
      type: GraphQLString,
      description: 'Human-readable device name'
    },
    sensors: {
      type: new GraphQLList(SensorType),
      description: 'Sensors that are connected to or operated by this device',
      resolve: async (src, args, ctx) => {
        const {
          db,
          dataloader
        } = ctx;
        const SensorModel = db.model('core:sensor');
        const ids = await SensorModel.sensorsByDeviceId(src.id);
        if (!ids.length) return null;
        return dataloader.sensorById.loadMany(ids.reduce((acc, doc) => acc.concat(doc._id), []));
      }
    }
  }
});