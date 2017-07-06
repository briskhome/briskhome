import {
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import DeviceType from '../types/Device';
import type { CoreImports } from '../../types/coreTypes';

export default ({ dataloader, db, log }: CoreImports) => {
  const DeviceModel = db.model('core:device');
  const Device = DeviceType({ dataloader, db, log });
  return ({
    type: new GraphQLList(Device),
    args: {
      id: {
        type: GraphQLString,
        description: 'ID of the device you want to fetch',
      },
      location: {
        type: GraphQLString,
        description: 'Location identifier',
      },
    },
    resolve: async (src, args, ctx, info) => {
      if (args.id) return dataloader.deviceById.loadMany([args.id]);
      if (args.location) {
        console.log(args);
        const ids = await DeviceModel.find({ location: args.location }).select('id').lean().exec();
        console.log({ ids });
        if (!ids.length) return null;
        return dataloader.deviceById.loadMany(ids.reduce((acc, doc) => acc.concat(doc._id), []));
      }
      return dataloader.deviceById.loadAll();
    },
  });
};
