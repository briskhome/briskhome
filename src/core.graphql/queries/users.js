/** @flow
 * @briskhome
 * └core.graphql <queries/users.js>
 */

import { GraphQLList, GraphQLString } from 'graphql';
import UserType from '../types/User';

export default {
  type: new GraphQLList(UserType),
  args: {
    id: {
      type: GraphQLString,
      description: 'Username of the user you are trying to fetch',
    },
  },
  resolve: async (src: Object, args: Object, ctx: Object) => {
    const { db } = ctx;
    const UserModel = db.model('core:user');
    if (args.id) return UserModel.findOne({ _id: args.id }).exec();
    return UserModel.find({}).exec();
  },
};
