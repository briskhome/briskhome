/** @flow
 * @briskhome
 * └core.db <models/UserModel.js>
 */

import type { CoreImports, ModelType } from '../../utilities/coreTypes';
import typeof { Mongoose$Model } from 'mongoose';

export type UserContactType = {
  name: string,
  value: string,
  levels: Array<number>,
};

export type UserDeviceType = {
  // TODO
};

export type UserSubscriptionType = {
  _id: string,
  levels: Array<number>,
};

export type UserLocationType = {
  // TODO
};

declare class UserType extends Mongoose$Model {
  _id: string,
  id: string,
  username?: string,
  firstName: string,
  lastName: string,
  type: 'guest' | 'regular' | 'superuser',
  contacts: Array<UserContactType>,
  devices: Array<UserDeviceType>,
  subscriptions: Array<UserSubscriptionType>,
  locations: Array<UserLocationType>,
  isDisabled: boolean,

  createdAt?: string,
  updatedAt?: string,
}

export type UserModelType = (
  document: UserType,
) => {
  fetchByUsername(id: string): UserModelType,
  fetchBySubscription(id: string): UserModelType,
} & UserType &
  ModelType<UserType>;

export default ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const userSchema = new Schema(
    {
      _id: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      type: {
        type: String,
        enum: ['guest', 'regular', 'superuser'],
      },
      contacts: [
        {
          name: String,
          value: String,
          levels: [Number],
        },
      ],
      devices: [], // ?
      subscriptions: [
        {
          _id: String,
          levels: [Number],
        },
      ],
      location: {
        long: String,
        lat: String,
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    {
      collection: 'users',
      timestamps: true,
    },
  );

  userSchema.virtual('name').get(function get() {
    return `${this.firstName} ${this.lastName}`;
  });

  userSchema
    .virtual('username')
    .get(function get() {
      return this._id;
    })
    .set(function set(username) {
      this._id = username;
    });

  userSchema.statics.fetchByUsername = async function fetchByUsername(
    username: string,
  ): Promise<UserType> {
    return this.findOne({ _id: username }).exec();
  };

  userSchema.statics.fetchBySubscription = async function fetchBySubscription(
    id: string,
  ): Promise<UserType> {
    return this.find({ 'subscriptions._id': id }).exec();
  };

  return db.model('core:user', userSchema);
};
