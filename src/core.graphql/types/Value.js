/** @flow
 * @briskhome
 * └core.graphql <types/Value.js>
 */

import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

export default (): GraphQLObjectType =>
  new GraphQLObjectType({
    name: 'Value',
    description: 'No desc for now',
    fields: {
      timestamp: {
        type: GraphQLString,
        description: 'Timestamp of when the value was collected',
      },
      type: {
        type: GraphQLString,
        description: 'Type of value',
      },
      value: {
        type: GraphQLString,
        description: 'Collected value',
      },
    },
  });
