/** @flow
 * @briskhome
 * └core.graphql <types/User.js>
 */

import { GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'User',
  description: 'This is a generic user',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique device identifier',
    },
    lastName: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
  },
});
