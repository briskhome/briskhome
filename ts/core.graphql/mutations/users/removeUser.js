/** @flow
 * @briskhome
 * └core.graphql <mutations/users/removeUser.js>
 */
import { GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { Context } from "../../../utilities/coreTypes";
export default {
  type: new GraphQLObjectType({
    name: 'removeUserPayload',
    fields: {
      result: {
        type: GraphQLBoolean
      }
    }
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'removeUserInput',
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
    await User.remove({
      username
    });
    return {
      result: true
    };
  }
};