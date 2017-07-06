import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';
import type { CoreGraphQL, CoreImports } from '../../types/coreTypes';

export default ({ dataloader, db, log }: CoreImports): CoreGraphQL => { 
  return new GraphQLObjectType({
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
};
