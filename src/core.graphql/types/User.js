/** @flow
 * @briskhome
 * └core.graphql <types/User.js>
 */

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';
import SessionType from './Session';
import typeof { SessionModel } from 'core.webapp/models/SessionModel';

export default new GraphQLObjectType({
  name: 'User',
  description: 'This is a generic user',
  fields: {
    lastName: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    isActive: {
      type: GraphQLBoolean,
    },
    sessions: {
      type: new GraphQLList(SessionType),
      resolve: async (obj, args, ctx) => {
        const { db } = ctx;
        const Session: SessionModel = db.model('SessionModel');
        return Session.fetchByUsername(obj.username);
      },
    },
  },
});

export const UserTypeEnum = new GraphQLEnumType({
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
