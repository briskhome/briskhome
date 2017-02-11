/**
 * @briskhome/core.log <lib/core.log/index.js>
 * └ models/log.model.js
 *
 * Модель данных записи журнала.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function (db) {
  const Schema = db.Schema;
  const LogSchema = new Schema({
    msg: {
      type: String,
      // required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
      index: {
        expires: 60,
      },
    },
    hostname: {
      type: String,
      required: true,
    },
    pid: {
      type: Number,
      required: true,
    },
    err: {
      type: Object,
    },
  }, {
    collection: 'logs',
    discriminatorKey: 'module',
    /** @todo  module => component */
  });

  // LogSchema.index({ time: 1 }, { expireAfterSeconds: 60 });

  return db.model('core:log', LogSchema);
};
