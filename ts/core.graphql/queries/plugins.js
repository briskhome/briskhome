/** @flow
 * @briskhome
 * └core.graphql <queries/plugins.js>
 */
import { GraphQLList } from 'graphql';
import Plugin from "../types/Plugin";
export default {
  type: new GraphQLList(Plugin),
  resolve: async () => null
};