import {
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import UserType from '../types/User';
import type { CoreImports } from '../../types/coreTypes';

export default ({ dataloader, db, log }: CoreImports) => {
  const User = UserType({ dataloader, db, log });
  return ({
    type: new GraphQLList(User),
    args: {
      id: {
        type: GraphQLString,
        description: 'Username of the user you are trying to fetch',
      },
    },
    resolve: async (src, args, ctx, info) => {
      if (args.id) return dataloader.userById.loadMany([args.id]);
      return dataloader.userById.loadAll();
    },
  });
};
