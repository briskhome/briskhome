/** @flow
 * @briskhome
 * └core.graphql <queries/welcome.js>
 */

import { GraphQLBoolean } from 'graphql';

export default {
  type: GraphQLBoolean,
  resolve: async (src: Object, args: Object, ctx: Object) => {
    const { db } = ctx;
    const UserModel = db.model('core:user');
    return !UserModel.count();
  },
};
