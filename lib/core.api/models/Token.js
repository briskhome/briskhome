/**
 * @briskhome/core.api <lib/core.api/index.js>
 * └ models/Token.js
 *
 * Модель данных кода доступа.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (db) {
  const Schema = db.Schema;
  const TokenSchema = new Schema({
    access_token: { type: String, required: true },
    cn: { type: String, required: true },
  }, {
    collection: 'access.tokens',
  });

  return db.model('сore:Token', TokenSchema);
};
