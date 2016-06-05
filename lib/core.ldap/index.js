/**
 * @briskhome/core.log <lib/core.log/index.js>
 *
 * Модуль службы каталогов.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log('core.ldap');
  const config = imports.config('core.ldap');

  const ldap = require('ldapjs');

  /**
   * Создает экземпляр соединения со службой каталогов.
   *
   * @constructor
   */
  function Ldap() {
    log.info('Инициализация соединения со службой каталогов');
    this.client = ldap.createClient({
      url: 'ldap://' + config.host,
    });

    this.client.bind('cn=admin,dc=briskhome,dc=com', 'password', function (err) {
      console.log('error', err);
      if (err) {
        log.error(err, 'Не удалось установить соединение со службой каталогов');
        this.client.unbind();
        return;
      }
    });
  }

  /**
   *
   */
  Ldap.prototype.findOne = function findOne(filter, base, callback) {
    if (typeof base === 'undefined') base = 'ou=people,dc=briskhome,dc=com';
    if (typeof filter === 'undefined') return callback(new Error('No filter!'));
    if (typeof callback === 'undefined') return;

    this.client.search(base, { filter, scope: 'sub' }, function (err, res) {
      if (err) {
        log.error(err);
        return callback(err);
      }

      res.on('searchEntry', function (entry) {
        console.log('entry: ' + JSON.stringify(entry.object));
        callback(null, entry);
      });

      res.on('searchReference', function (referral) {
        console.log('referral: ' + referral.uris.join());
      });

      res.on('error', function (err) {
        log.error(err, 'При выполнении запроса в службу каталогов произошла ошибка');
        return callback(err);
      });

      res.on('end', function (result) {
        if (result !== 0) log.warn('Код завершения отличный от нуля: ' + result);
        return callback(result);
      });
    });
  };

  register(null, { ldap });
};
