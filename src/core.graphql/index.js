/** @flow
 * @briskhome
 * └core.graphql <index.js>
 */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import devices from './queries/devices';
import plugins from './queries/plugins';
import users from './queries/users';
import welcome from './queries/welcome';
import me from './queries/me';
import login from './mutations/authorisation/login';
import createUser from './mutations/users/createUser';
import disableUser from './mutations/users/disableUser';
import removeUser from './mutations/users/removeUser';
import type { CoreOptions, CoreImports } from '../utilities/coreTypes';

export default (options: CoreOptions, imports: CoreImports) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        devices,
        plugins,
        users,
        me,
        welcome,
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: {
        createUser,
        disableUser,
        removeUser,
        login,
      },
    }),
  });

  return { schema };
};
