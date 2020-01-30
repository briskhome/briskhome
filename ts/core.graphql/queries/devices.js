/** @flow
 * @briskhome
 * └core.graphql <queries/devices.js>
 */
import { GraphQLList, GraphQLString } from 'graphql';
import DeviceType from "../types/Device";
export default {
  type: new GraphQLList(DeviceType),
  args: {
    id: {
      type: GraphQLString,
      description: 'ID of the device you want to fetch'
    },
    location: {
      type: GraphQLString,
      description: 'Location identifier'
    }
  },
  resolve: async (src: object, args: object, ctx: object) => {
    const {
      dataloader,
      db
    } = ctx;
    const DeviceModel = db.model('core:device');
    if (args.id) return dataloader.deviceById.loadMany([args.id]);

    if (args.location) {
      const ids = await DeviceModel.find({
        location: args.location
      }).select('id').lean().exec();
      if (!ids.length) return null;
      return dataloader.deviceById.loadMany(ids.reduce((acc, doc) => acc.concat(doc._id), []));
    }

    return dataloader.deviceById.loadAll();
  }
};