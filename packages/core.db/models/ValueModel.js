/**
 * @briskhome
 * └core.db <models/ValueModel.js>
 */

import moment from 'moment';
import type { CoreImports, ModelType } from '../../utilities/coreTypes';

export type ValueValueType = {
  timestamp?: Date,
  type: string,
  value: string,
};

export type ValueType = {
  sensor: string,
  values: Array<ValueValueType>,
  timestamp: string,
};

export type ValueModelType = (
  document: ModelType,
) => {} & ValueType & ModelType<ValueModelType>;

const operators = {
  lt: (boundary: any, value: any) => boundary < value,
  gt: (boundary: any, value: any) => boundary > value,
  lte: (boundary: any, value: any) => boundary <= value,
  gte: (boundary: any, value: any) => boundary >= value,
  eq: (boundary: any, value: any) => boundary === value,
};

export default ({ bus, db }: CoreImports) => {
  const Schema = db.Schema;
  const SensorModel = db.model('core:sensor');
  const ValueSchema = new Schema(
    {
      sensor: { type: String, ref: 'core:sensor' },
      values: [{ type: db.Schema.Types.Mixed, _id: false }],
      timestamp: { type: Date, default: moment().startOf('day') },
    },
    {
      collection: 'values',
    },
  );

  ValueSchema.statics.upsertValue = async function upsertValue(
    sensor: string,
    { timestamp, type, value }: ValueValueType,
  ) {
    const fetchedSensor = SensorModel.findOne({
      _id: sensor,
      'bounds.type': type,
    });
    if (fetchedSensor) {
      const boundsForType = fetchedSensor.bounds.filter(
        boundary => boundary.type === type,
      );
      Object.keys(boundsForType).forEach(boundary => {
        if (
          Object.keys(operators).includes(boundary.operation) &&
          operators[boundary.operation](boundary.value, value)
        ) {
          bus.emit('broadcast:outofbounds');
        }
      });
    }

    let reading = await this.findOne({
      sensor,
      timestamp: timestamp
        ? moment(timestamp)
            .utc()
            .startOf('day')
        : moment()
            .utc()
            .startOf('day')
            .toDate(),
    }).exec();

    if (!value)
      reading = new this({
        sensor,
        timestamp: moment()
          .utc()
          .startOf('day')
          .toDate(),
        values: [],
      });
    reading.values.push({
      timestamp: timestamp
        ? moment(timestamp)
            .utc()
            .toDate()
        : moment()
            .utc()
            .toDate(),
      value,
      type,
    });

    reading.markModified('values');
    return reading.save();
  };

  return db.model('core:value', ValueSchema);
};
