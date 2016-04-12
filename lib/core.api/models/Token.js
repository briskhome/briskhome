'use strict';

module.exports = function (db) {
  const Schema = db.Schema;
  const TokenSchema = new Schema({
    access_token: { type: String, required: true },
    cn: { type: String, required: true },
  }, {
    collection: 'access.tokens',
  });
  return db.model('Token', TokenSchema);
};
