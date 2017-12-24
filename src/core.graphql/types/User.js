/** @flow
 * @briskhome
 * └core.graphql <types/User.js>
 */

import { GraphQLEnumType, GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'User',
  description: 'This is a generic user',
  fields: {
    lastName: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    username: {
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

export const UserTypeEnum = new GraphQLEnumType({
  name: 'UserTypeEnum',
  values: {
    guest: {
      value: 'guest',
    },
    regular: {
      value: 'regular',
    },
    superuser: {
      value: 'superuser',
    },
  },
});
