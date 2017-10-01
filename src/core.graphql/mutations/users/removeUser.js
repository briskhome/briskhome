/** @flow
 * @briskhome
 * └core.graphql <mutations/users/suspendUser.js>
 */

import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';

import type Mongoose from 'mongoose';
import type { Mongoose$Model } from 'mongoose';
import type { CoreContextType } from '../../../utilities/coreTypes';
// import type { UserType } from '../../../core.db/models/UserModel';

declare class UserType extends Mongoose$Model {
  _id: string,
  id: string,
  username?: string,
  firstName: string,
  lastName: string,
  type: 'guest' | 'regular' | 'superuser',
  contacts: Array<UserContactType>,
  devices: Array<UserDeviceType>,
  subscriptions: Array<UserSubscriptionType>,
  locations: Array<UserLocationType>,

  createdAt?: string,
  updatedAt?: string,
}

export default {
  type: new GraphQLObjectType({
    name: 'removeUserPayload',
    fields: {
      result: {
        type: GraphQLBoolean,
      },
    },
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'removeUserInput',
        fields: {
          username: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
      }),
    },
  },
  resolve: async (obj: Object, args: Object, context: CoreContextType) => {
    const { db } = context;
    const { input: { username } } = args;
    const User: Mongoose$Model<UserType> = db.model('core:user');
    return User.remove({ _id: username });
  },
};
