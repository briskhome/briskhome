/** @flow
 * @briskhome
 * └core.graphql <index.js>
 */

import {
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import devicesQuery from './queries/devices';
import pluginsQuery from './queries/plugins';
import usersQuery from './queries/users';
import createUser from './mutations/users/createUser';
import disableUser from './mutations/users/disableUser';
import removeUser from './mutations/users/removeUser';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

export default (
  options: Object,
  imports: CoreImports,
  register: CoreRegister,
) => {
  const log = imports.log();
  const devices = devicesQuery({ ...imports, log });
  const plugins = pluginsQuery({ ...imports, log });
  const users = usersQuery({ ...imports, log });

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
