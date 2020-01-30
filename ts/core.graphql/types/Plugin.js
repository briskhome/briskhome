/** @flow
 * @briskhome
 * └core.graphql <types/Plugin.js>
 */
import { GraphQLBoolean, GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
export default new GraphQLObjectType({
  name: 'Plugin',
  description: 'Briskhome plugin',
  fields: {
    name: {
      type: GraphQLString,
      resolve: p => p.plugin.name || p.name
    },
    description: {
      type: GraphQLString,
      resolve: p => p.description || 'No description provided'
    },
    version: {
      type: GraphQLString
    },
    author: {
      type: GraphQLString
    },
    disabled: {
      type: GraphQLBoolean,
      resolve: p => !!p.disabled
    },
    consumes: {
      type: new GraphQLList(GraphQLString),
      resolve: p => p.plugin.consumes
    },
    provides: {
      type: new GraphQLList(GraphQLString),
      resolve: p => p.plugin.provides
    }
  }
});