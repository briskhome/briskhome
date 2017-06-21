/** @flow
 * @briskhome
 * └core.db <lib/core.db/models/UserModel.js>
 */

import type mongoose from 'mongoose';
import type { ModelType } from '../../types/coreTypes';

export type UserContactType = {
  name: string,
  value: string,
  levels: Array<number>,
};

export type UserDeviceType = {
  // TODO
}

export type UserSubscriptionType = {
  _id: string,
  levels: Array<number>,
};

export type UserLocationType = {
  // TODO
}

export type UserType = {
  _id?: string,
  id: string,
  // username: string,
  firstName: string,
  lastName: string,
  type: 'guest' | 'user' | 'superuser',
  contacts: Array<UserContactType>,
  devices: Array<UserDeviceType>,
  subscriptions: Array<UserSubscriptionType>,
  locations: Array<UserLocationType>,

  createdAt?: string,
  updatedAt?: string,
};

export type UserModelType = (document: UserType) => {
  fetchByUsername(id: string): UserModelType,
  fetchBySubscription(id: string): UserModelType,
} & UserType & ModelType<UserModelType>;

export default (db: mongoose) => {
  const Schema = db.Schema;
  const userSchema = new Schema({
    _id: {
      type: String,
    },
    // username: {
    //   type: String,
    //   unique: true,
    // },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    type: {
      type: String,
      enum: [
        'guest',
        'user',
        'superuser',
      ],
    },
    contacts: [{
      name: String,
      value: String,
      levels: [Number],
    }],
    devices: [], // ?
    subscriptions: [{
      _id: String,
      levels: [Number],
    }],
    location: {
      long: String,
      lat: String,
    },
  }, {
    collection: 'users',
    timestamps: true,
  });

  userSchema.virtual('name')
    .get(function get() {
      return `${this.firstName} ${this.lastName}`;
    });

  userSchema.virtual('username')
    .get(function get() {
      return this._id;                                                        // eslint-disable-line
    })
    .set(function set(username) {
      this._id = username;                                                    // eslint-disable-line
    });

  userSchema.statics.fetchByUsername = async function fetchByUsername(username: string)
    : Promise<UserType> {
    return this.findOne({ _id: username }).exec();
  };

  userSchema.statics.fetchBySubscription = async function fetchBySubscription(id: string)
    : Promise<UserType> {
    return this.find({ 'subscriptions._id': id }).exec();
  };

  return db.model('core:user', userSchema);
};
