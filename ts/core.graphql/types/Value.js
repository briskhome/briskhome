/** @flow
 * @briskhome
 * └core.graphql <types/Value.js>
 */
import { GraphQLString, GraphQLObjectType } from 'graphql';
export default new GraphQLObjectType({
  name: 'Value',
  description: 'No desc for now',
  fields: {
    timestamp: {
      type: GraphQLString,
      description: 'Timestamp when value was collected'
    },
    type: {
      type: GraphQLString,
      description: 'Type of value'
    },
    value: {
      type: GraphQLString,
      description: 'Value it is'
    }
  }
});