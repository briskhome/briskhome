/** @flow
 * @briskhome
 * └core.graphql <queries/users.js>
 */

import {
  GraphQLList,
  GraphQLString,
} from 'graphql';
import UserType from '../types/User';
import type { CoreImports } from '../../utilities/coreTypes';

export default (imports: CoreImports) => {
  const { dataloader } = imports;
  const User = UserType(imports);
  return ({                                                                                                // $FlowFixMe
    type: new GraphQLList(User),
    args: {
      id: {
        type: GraphQLString,
        description: 'Username of the user you are trying to fetch',
      },
    },
    resolve: async (src: Object, args: Object) => {
      if (args.id) return dataloader.userById.loadMany([args.id]);
      return dataloader.userById.loadAll();
    },
  });
};
