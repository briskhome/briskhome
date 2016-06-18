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
      // log,
    });

    this.client.bind('cn=admin,dc=briskhome,dc=com', 'password', function (err) {
      if (err) {
        log.error(err, 'Не удалось установить соединение со службой каталогов');
        this.client.unbind();
        return;
      }
    }.bind(this));
  }

  /**
   * Функция поиска записей в службе каталогов по заданным параметрам.
   * Возвращает несколько записей. Документация по фильтрам: http://ldapjs.org/filters.html
   *
   * @param {String} query
   * @param {Object} options
   * @callback callback
   */
  Ldap.prototype.find = function (query, options, callback) {
    if (typeof query === 'undefined') return callback(new Error('Не заданы параметры поиска'));
    if (typeof options === 'function') callback = options;
    if (typeof callback === 'undefined') throw new Error('Отсутствует замыкание функции');

    const base = options.base || 'ou=people,dc=briskhome,dc=com';
    const scope = options.scope || 'sub';
    const filter = query.charAt[0] === '(' ? query : `(cn=${query})`;
    const sizeLimit = options.sizeLimit || 0;

    this.client.search(base, { filter, scope, sizeLimit }, function (err, res) {
      if (err) {
        log.error(err);
        return callback(err);
      }

      res.on('error', function (err) {
        log.error(err);
        return callback(err);
      });

      res.on('searchEntry', function (data) {
        callback(null, data.object);
      });
    });
  };

  /**
   * Функция поиска записи в службе каталогов по заданным параметрам.
   * Возвращает одну запись. В случае, если найдено несколько, возвращает первую найденную.
   *
   * @param {String} query
   * @param {Object} options
   * @callback callback
   */
  Ldap.prototype.findOne = function findOne(query, options, callback) {
    if (typeof query === 'undefined') return callback(new Error('Не заданы параметры поиска'));
    if (typeof options === 'function') callback = options;
    if (typeof callback === 'undefined') throw new Error('Отсутствует замыкание функции');

    this.find(query, { sizeLimit: 1 }, callback);
  };

  /**
   *
   */
  Ldap.prototype.insert = function insert(query, options, callback) {
    if (typeof query === 'undefined') return callback(new Error('Не заданы параметры поиска'));
    if (typeof options === 'function') callback = options;
    if (typeof callback === 'undefined') throw new Error('Отсутствует замыкание функции');

    const dn = options.dn || 'ou=people,dc=briskhome,dc=com';
    const entry = {
      cn: '', // логин
      gn: '', // имя
      sn: '', // фамилия
      email: '',
      objectclass: ['inetOrgPerson', 'organizationalPerson', 'person', 'top'],
      userPassword: '',
    };

    this.client.add(dn, entry, function(err) {
      if (err) {
        log.error(err);
        return callback(err);
      } else {
        callback(null, true);
      }
    });
  };

  register(null, { ldap: new Ldap() });
};
