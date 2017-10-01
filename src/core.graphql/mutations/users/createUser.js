/** @flow
 * @briskhome
 * └core.graphql <mutations/users/createUser.js>
 */

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
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

type GenerateUsernameInput = {|
  lastName: string,
  firstName: string,
  db: Mongoose,
|};

const generateUsername = async ({
  lastName,
  firstName,
  db,
}: GenerateUsernameInput): Promise<string> => {
  const username = `${firstName[0]}${lastName}`.toLocaleLowerCase();
  const UserModel: Mongoose$Model<UserType> = db.model('core:user');

  const users: Array<string> = await UserModel.find({
    _id: new RegExp(`^${username}`, 'i'),
  });

  if (users.length === 0) return username;
  return `${username}${users.length + 1}`;
};

const UserTypeEnum = new GraphQLEnumType({
  name: 'UserTypeEnum',
  values: {
    guest: {
      value: 'guest',
    },
    regular: {
      value: 'regular',
    },
    superuser: {
      value: 'superuser',
    },
  },
});

export default {
  type: new GraphQLObjectType({
    name: 'createUserPayload',
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
        name: 'createUserInput',
        fields: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
          type: {
            type: new GraphQLNonNull(UserTypeEnum),
            description: 'A set of priviliges the user should have',
          },
        },
      }),
    },
  },
  resolve: async (obj: Object, args: Object, context: CoreContextType) => {
    const { db, log } = context;
    log.info({ mutation: 'createUser' }, { args });
    const { input: { lastName, firstName, password, type } } = args;
    const User: Mongoose$Model<UserType> = db.model('core:user');
    const user = new User({
      _id: await generateUsername({ db, lastName, firstName }),
      lastName,
      firstName,
      password,
      type,
    });
    return user.save();
  },
};
