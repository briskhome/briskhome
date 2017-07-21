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
import ValueType from './Value';
import type { CoreImports } from '../../utilities/coreTypes';

const BoundaryType = new GraphQLObjectType({
  type: {
    type: GraphQLString,
    description: 'Type of value this boundary applies to',
  },
  operation: {
    type: GraphQLString,
    description: 'Type of boundary',
  },
  value: {
    type: GraphQLString,
    description: 'Boundary value',
  },
});

export default (imports: CoreImports): GraphQLObjectType => {
  const { db } = imports;
  const ValueModel = db.model('core:value');
  const Value = ValueType(imports);
  return new GraphQLObjectType({
    name: 'Sensor',
    description: 'A sensor registered with Briskhome',
    fields: {
      id: {
        type: GraphQLString,
        description: 'Unique sensor identifier (e.g. serial number)',
      },
      device: {
        type: GraphQLString,
        description: 'A device that controls this sensor',
      },
      types: {
        type: new GraphQLList(GraphQLString),
        description: 'Types of values this sensor collects',
        resolve: s => s.values,
      },
      bounds: {
        type: new GraphQLList(BoundaryType),
        description: 'Sensor value boundaries by value types',
      },
      location: {
        type: GraphQLString,
        description: 'Location identifier',
      },
      values: {
        type: new GraphQLList(Value),
        description: 'A list of values',
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
          const query = await ValueModel.find({
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
