/** @flow
 * @briskhome
 * └core.graphql <lib/core.graphql/index.js>
 */

import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import type { CoreGraphQL, CoreImports } from '../../types/coreTypes';

export default ({ dataloader, db, log }: CoreImports): CoreGraphQL => {
  return new GraphQLObjectType({
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
};
