/**
 * @briskhome/core.api <lib/core.api/index.js>
 * └ models/token.model.js
 *
 * Модель данных кода доступа API.
 * Это временное решение, в дальнейшем коды доступа будут храниться в LDAP.
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

  return db.model('сore:token', TokenSchema);
};
