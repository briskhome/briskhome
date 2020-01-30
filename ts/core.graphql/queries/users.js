/** @flow
 * @briskhome
 * └core.graphql <queries/users.js>
 */
import { GraphQLList, GraphQLString } from 'graphql';
import UserType from "../types/User";
export default {
  type: new GraphQLList(UserType),
  args: {
    username: {
      type: GraphQLString,
      description: 'Username of the user you are trying to fetch'
    }
  },
  resolve: async (src: object, args: object, ctx: object) => {
    const {
      db
    } = ctx;
    const UserModel = db.model('core:user');
    if (args.username) return [].concat((await UserModel.fetchByUsername(args.username, {
      lean: true
    })));
    return UserModel.find({}).exec();
  }
};