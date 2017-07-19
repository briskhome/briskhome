/** @flow
 * @briskhome
 * └core.graphql <types/Sensor.js>
 */

import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import moment from 'moment';
import ReadingType from './Reading';
import type { CoreImports } from '../../utilities/coreTypes';

export default (imports: CoreImports): GraphQLObjectType => {
  const { db } = imports;
  const ReadingModel = db.model('core:reading');
  const Reading = ReadingType(imports);
  return new GraphQLObjectType({
    name: 'Sensor',
    description: 'This is a generic sensor',
    fields: {
      id: {
        type: GraphQLString,
        description: 'Unique sensor identifier',
      },
      types: {
        type: new GraphQLList(GraphQLString),
        description: 'Types of values this sensor collects',
        resolve: s => s.values,
      },
      values: {
        type: new GraphQLList(Reading),
        description: 'A list of readings',
        args: {
          type: {
            type: GraphQLString,
            description: 'Value types to return if sensor owns more than one value type.',
          },
          from: {
            type: GraphQLString,
            description: 'Beginning of a period',
            defaultValue: moment().subtract(1, 'days'),
          },
          to: {
            type: GraphQLString,
            description: 'End of a period',
            defaultValue: moment(),
          },
        },
        resolve: async (src, args) => {
          const type = args.type || (src.values.length === 1 ? src.values[0] : null);
          if (!type) return null;
          const query = await ReadingModel.find({
            sensor: src._id,
            timestamp: { $gte: moment(args.from).utc().startOf('day'), $lte: moment(args.to).utc().endOf('day') },
            'values.type': type,
            'values.timestamp': { $gte: moment(args.from).utc().toDate(), $lte: moment(args.to).utc().toDate() },
          }).exec();
          if (!query.length) return null;
          return query.reduce((acc, day) =>
            acc.concat(day.values.map(v => ({
              timestamp: moment(v.timestamp).local().format(),
              value: v.value,
            }))),
            [],
          );
        },
      },
    },
  });
};
