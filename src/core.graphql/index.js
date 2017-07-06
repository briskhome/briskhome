/** @flow
 * @briskhome
 * └core.graphql <lib/core.graphql/index.js>
 */

/* eslint-disable */

import {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql';
import moment from 'moment';
import devicesQuery from './queries/devices';
import usersQuery from './queries/users';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';
// import Device from './types/Device';
// import Sensor from './types/Sensor';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const log = imports.log();
  const db = imports.db;

  console.log('===>');
  console.log(moment().toDate());
  console.log(moment().startOf('day').toDate());

  const devices = devicesQuery({ ...imports, log });
  const users = usersQuery({ ...imports, log });

  // ReadingModel.upsertReading('76bb5328-ec36-4de3-99a1-24382be8741e', { type: 'temperature', value: '15' });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        devices,
        users
      },
    }),
    // mutation: new GraphQLObjectType({

    // }),
  });

  return register(null, { graphql: { schema } });
};
