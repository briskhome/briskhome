/**
 * @briskhome
 * └core.notifications <lib/core.notifications/models/EventModel.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function model (db) {
  const Schema = db.Schema;
  const eventSchema = new Schema({
    _id: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      unique: true
    },
    level: {
      type: Number,
      default: 40
    },
    description: {
      type: String
    },
    component: {
      type: String
    }
  }, {
    collection: 'events',
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  });

  eventSchema.statics.fetchById = async function fetchById (id) {
    return this.findOne({ _id: id }).exec();
  };

  return db.model('core:event', eventSchema);
};
