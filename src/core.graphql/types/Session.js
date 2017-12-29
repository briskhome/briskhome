/** @flow
 * @briskhome
 * └core.graphql <types/Session.js>
 */

import { GraphQLBoolean, GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'Session',
  fields: {
    id: {
      type: GraphQLString,
    },
    issued: {
      type: GraphQLString,
    },
    expires: {
      type: GraphQLString,
    },
    browser: {
      type: GraphQLString,
    },
    device: {
      type: GraphQLString,
    },
    os: {
      type: GraphQLString,
    },
    ip: {
      type: GraphQLString,
    },
    isCurrent: {
      type: GraphQLBoolean,
      resolve: (obj, _, ctx) => obj.id === ctx.req.sessionID,
    },
  },
});
