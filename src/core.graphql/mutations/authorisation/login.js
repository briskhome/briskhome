/** @flow
 * @briskhome
 * └core.graphql <mutations/authorisation/login.js>
 */

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import { UserTypeEnum } from '../../types/User';
import type { CoreContextType } from '../../../utilities/coreTypes';

type LoginInput = {|
  input: {
    username: string,
    password: string,
  },
|};

export default {
  type: new GraphQLObjectType({
    name: 'loginPayload',
    fields: {
      firstName: {
        type: GraphQLString,
      },
      lastName: {
        type: GraphQLString,
      },
      username: {
        type: GraphQLString,
      },
      type: {
        type: UserTypeEnum,
      },
    },
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'loginInput',
        fields: {
          username: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
      }),
    },
  },
  resolve: async (obj: Object, args: LoginInput, context: CoreContextType) => {
    const { db, log } = context;
    const { input: { username, password } } = args;
    log.info({ mutation: 'authorisation.login' }, { args });
    const UserModel = db.model('core:user');
    const user = await UserModel.fetchByUsername(username, { lean: true });
    if (!user) throw new Error('E_INVALID_USERNAME');
    if (user.password !== password) throw new Error('E_INVALID_PASSWORD');
    return user;
  },
};
