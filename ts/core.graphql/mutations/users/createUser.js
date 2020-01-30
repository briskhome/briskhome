/** @flow
 * @briskhome
 * └core.graphql <mutations/users/createUser.js>
 */
import { GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserTypeEnum } from "../../types/User";
import { Context } from "../../../utilities/coreTypes";
type GenerateUsernameInput = {
  lastName: string;
  firstName: string;
  db: typeof mongoose;
};

const generateUsername = async ({
  lastName,
  firstName,
  db
}: GenerateUsernameInput): Promise<string> => {
  const username = `${firstName[0]}${lastName}`.toLocaleLowerCase();
  const UserModel = db.model('core:user');
  const users: Array<string> = await UserModel.find({
    username: new RegExp(`^${username}`, 'i')
  });
  if (users.length === 0) return username;
  return `${username}${users.length + 1}`;
};

export default {
  type: new GraphQLObjectType({
    name: 'createUserPayload',
    fields: {
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      },
      username: {
        type: GraphQLString
      },
      type: {
        type: UserTypeEnum
      }
    }
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'createUserInput',
        fields: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          },
          type: {
            type: new GraphQLNonNull(UserTypeEnum),
            description: 'A set of priviliges the user should have'
          }
        }
      })
    }
  },
  resolve: async (obj: object, args: object, context: Context) => {
    const {
      db,
      log
    } = context;
    log.info({
      mutation: 'createUser'
    }, {
      args
    });
    const {
      input: {
        lastName,
        firstName,
        password,
        type
      }
    } = args;
    const User = db.model('core:user');
    const user = new User({
      username: await generateUsername({
        db,
        lastName,
        firstName
      }),
      lastName,
      firstName,
      password: await bcrypt.hash(password, 10),
      type
    });
    return user.save();
  }
};