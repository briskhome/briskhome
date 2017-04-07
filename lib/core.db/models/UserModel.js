/**
 * @briskhome
 * └core.db <lib/core.db/models/UserModel.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function model (db) {
  const Schema = db.Schema;
  const userSchema = new Schema({
    // _id: {
    //   type: String
    // },
    username: {
      type: String,
      unique: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    contacts: [{
      name: String,
      value: String,
      levels: [Number]
    }],
    devices: [], // ?

    // Array of events a user is subscribed to.
    subscriptions: [{
      _id: String,
      levels: [Number]
    }],
    location: {
      long: String,
      lat: String
    }
  }, {
    collection: 'users',
    timestamps: true
  });

  userSchema.statics.fetchByUsername = async function fetchByUsername (username) {
    return this.findOne({ username }).exec();
  };

  userSchema.statics.fetchBySubscription = async function fetchBySubscription (id) {
    return this.find({ 'subscriptions._id': id }).exec();
  };

  return db.model('core:user', userSchema);
};
