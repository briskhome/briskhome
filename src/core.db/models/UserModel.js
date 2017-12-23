/** @flow
 * @briskhome
 * └core.db <models/UserModel.js>
 */

import type { CoreImports } from '../../utilities/coreTypes';

export default ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const userSchema = new Schema(
    {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      username: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        required: true,
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

  userSchema.statics.fetchByUsername = async function fetchByUsername(
    username: string,
    opts?: { lean?: boolean } = {},
  ): Promise<*> {
    return this.findOne({ username })
      .lean(opts && opts.lean)
      .exec();
  };

  userSchema.statics.fetchBySubscription = async function fetchBySubscription(
    id: string,
  ): Promise<*> {
    return this.find({ 'subscriptions._id': id }).exec();
  };

  return db.model('core:user', userSchema);
};
