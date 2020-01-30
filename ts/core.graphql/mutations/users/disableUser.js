/** @flow
 * @briskhome
 * └core.graphql <mutations/users/disableUser.js>
 */
import { GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { Context } from "../../../utilities/coreTypes";
export default {
  type: new GraphQLObjectType({
    name: 'disableUserPayload',
    fields: {
      result: {
        type: GraphQLBoolean
      }
    }
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'disableUserInput',
        fields: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        }
      })
    }
  },
  resolve: async (obj: object, args: object, context: Context) => {
    const {
      db
    } = context;
    const {
      input: {
        username
      }
    } = args;
    const User = db.model('core:user');
    const user = await User.findOne({
      _id: username
    });
    user.isDisabled = true;
    await user.save();
    return {
      result: true
    };
  }
};