/** @flow
 * @briskhome
 * └core.graphql <index.js>
 */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import devices from './queries/devices';
import plugins from './queries/plugins';
import users from './queries/users';
import createUser from './mutations/users/createUser';
import disableUser from './mutations/users/disableUser';
import removeUser from './mutations/users/removeUser';
import type {
  CoreOptions,
  CoreImports,
  CoreRegister,
} from '../utilities/coreTypes';

export default (
  options: CoreOptions,
  imports: CoreImports,
  register: CoreRegister,
) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        devices,
        plugins,
        users,
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: {
        createUser,
        disableUser,
        removeUser,
      },
    }),
  });

  return register(null, { graphql: { schema } });
};
