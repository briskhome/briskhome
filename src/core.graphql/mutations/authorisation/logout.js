/** @flow
 * @briskhome
 * └core.graphql <mutations/authorisation/logout.js>
 */

import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import type { Context } from '../../../utilities/coreTypes';
import typeof { SessionModel } from 'core.webapp/models/SessionModel';

type LogoutInput = {|
  input: {
    id?: string,
  },
|};

export default {
  type: new GraphQLObjectType({
    name: 'logoutPayload',
    fields: {
      result: {
        type: GraphQLBoolean,
      },
    },
  }),
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'logoutInput',
        fields: {
          id: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (obj: Object, args: LogoutInput, context: Context) => {
    const { db, log, logout, req: { sessionID, user } } = context;
    const { input: { id = sessionID } } = args;

    log.info({ mutation: 'authorisation.logout' });
    const Session: SessionModel = db.model('SessionModel');

    const session = await Session.findOne({
      _id: id,
      'session.passport.user.username': user.username,
    });

    if (!session) {
      log.warn(
        { user: { username: user.username, type: user.type } },
        'Unable to log user out',
      );
      throw new Error('ACCESS_DENIED');
    }

    if (id === sessionID) {
      try {
        await logout();
      } catch (e) {
        log.warn(
          { user: { username: user.username, type: user.type } },
          'Unable to log user in',
        );
      }
    } else {
      await Session.remove({ _id: id });
    }

    return { result: true };
  },
};
