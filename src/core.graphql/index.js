/** @flow
 * @briskhome
 * └core.graphql <index.js>
 */

import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';
import devicesQuery from './queries/devices';
import usersQuery from './queries/users';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const log = imports.log();

  const devices = devicesQuery({ ...imports, log });
  const users = usersQuery({ ...imports, log });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        devices,
        users,
      },
    }),
    // mutation: new GraphQLObjectType({

    // }),
  });

  return register(null, { graphql: { schema } });
};
