/** @flow
 * @briskhome
 * └core.graphql <mutations/users/createUser.js>
 */

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import { UserTypeEnum } from '../../types/User';
import type Mongoose from 'mongoose';
import type { CoreContextType } from '../../../utilities/coreTypes';

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
  const UserModel = db.model('core:user');

  const users: Array<string> = await UserModel.find({
    _id: new RegExp(`^${username}`, 'i'),
  });

  if (users.length === 0) return username;
  return `${username}${users.length + 1}`;
};

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
    const User = db.model('core:user');
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
