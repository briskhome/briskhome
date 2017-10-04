/** @flow
 * @briskhome
 * └core.notifications <models/EventModel.js>
 */

import type { CoreImports } from '../../utilities/coreTypes';

export type EventType = {
  _id?: string,
  id: string,
  name: string,
  level?: number,
  description?: string,
  component: string,
  createdAt?: string,
  updatedAt?: string,
};

// export type EventModelType = (document: EventType) => {
//   fetchById(id: string): EventModelType,
// } & EventType & ModelType<EventModelType>;

export default ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const eventSchema = new Schema({
    _id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      unique: true,
    },
    level: {
      type: Number,
      default: 40,
    },
    description: {
      type: String,
    },
    component: {
      type: String,
    },
  }, {
    collection: 'events',
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated',
    },
  });

  eventSchema.statics.fetchById = async function fetchById(id: string): Promise<EventType> {
    return this.findOne({ _id: id }).exec();
  };

  return db.model('core:event', eventSchema);
};
