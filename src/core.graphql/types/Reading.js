/** @flow
 * @briskhome
 * └core.graphql <types/Reading.js>
 */

import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

export default (): GraphQLObjectType =>
  new GraphQLObjectType({
    name: 'Reading',
    description: 'No desc for now',
    fields: {
      timestamp: {
        type: GraphQLString,
        description: 'Timestamp when value was collected',
      },
      type: {
        type: GraphQLString,
        description: 'Type of value',
      },
      value: {
        type: GraphQLString,
        description: 'Value it is',
      },
    },
  });
