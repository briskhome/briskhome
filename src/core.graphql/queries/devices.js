import {
  GraphQLList,
  GraphQLString,
} from 'graphql';
import DeviceType from '../types/Device';
import type { CoreImports } from '../../utilities/coreTypes';

export default (imports: CoreImports) => {
  const { dataloader, db } = imports;
  const DeviceModel = db.model('core:device');
  const Device = DeviceType(imports);
  return ({                                                                                                // $FlowFixMe
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
    resolve: async (src: Object, args: Object) => {
      if (args.id) return dataloader.deviceById.loadMany([args.id]);
      if (args.location) {
        const ids = await DeviceModel.find({ location: args.location }).select('id').lean().exec();
        if (!ids.length) return null;
        return dataloader.deviceById.loadMany(ids.reduce((acc, doc) => acc.concat(doc._id), []));
      }
      return dataloader.deviceById.loadAll();
    },
  });
};
