/** @flow
 * @briskhome
 * └core.graphql <queries/devices.js>
 */

import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';

export default ({
  type: new GraphQLObjectType({
    name: 'createUserPayload',
    fields: {
      firstName: {
        type: GraphQLString,
        description: 'Имя пользователя',
      },
      lastName: {
        type: GraphQLString,
        description: 'Фамилия пользователя',
      },
      username: {
        type: GraphQLString,
        description: 'Логин',
      },
      type: {
        type: GraphQLString, // TODO -> GraphQLEnumType
        description: 'Тип пользователя',
      },
    },
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'createUserInput',
        fields: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Last name',
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'First name',
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Password',
          },
          type: {
            type: new GraphQLNonNull(GraphQLString), // TODO -> GraphQLEnumType
            description: 'A set of priviliges the user should have',
          },
        },
      }),
    },
  },
  resolve: (obj: Object, args: Object, context: Object) => {
    console.log(args, context);
    return null;
  },
});
