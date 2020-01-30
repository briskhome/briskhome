/** @flow
 * @briskhome
 * └core.graphql <queries/welcome.js>
 */
import { GraphQLBoolean } from 'graphql';
export default {
  type: GraphQLBoolean,
  resolve: async (src: object, args: object, ctx: object) => {
    const {
      db
    } = ctx;
    const UserModel = db.model('core:user');
    const count = await UserModel.count();
    return !count;
  }
};