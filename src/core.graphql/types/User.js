/** @flow
 * @briskhome
 * └core.graphql <types/User.js>
 */

import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

export default (): GraphQLObjectType =>
  new GraphQLObjectType({
    name: 'User',
    description: 'A Briskhome user',
    fields: {
      id: {
        type: GraphQLString,
        description: 'Unique device identifier',
      },
      lastName: {
        type: GraphQLString,
        description: 'Last name',
      },
      firstName: {
        type: GraphQLString,
        description: 'First name',
      },
      name: {
        type: GraphQLString,
        description: 'Name',
      },
      role: {
        type: GraphQLString,
        description: 'Either admin, user or guest',
      },
    },
  });
