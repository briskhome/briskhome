/**
 * @briskhome/core.log <lib/core.log/index.js>
 *
 * Модуль службы каталогов.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const ldap = require('ldapjs');

module.exports = function setup(options, imports, register) {
  const log = imports.log('core.ldap');
  const config = imports.config('core.ldap');

  /**
   * Создает экземпляр соединения со службой каталогов.
   *
   * @constructor
   */
  function Ldap() {
    log.info('Инициализация соединения со службой каталогов');

    this.client = ldap.createClient({
      url: `ldap://${config.host}`,
      // log,
    });

    // TODO: Change to Func.proto.call(this);
    this.client.bind('cn=admin,dc=briskhome,dc=com', 'password', function bind(err) {
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
  Ldap.prototype.find = function find(query, opts, callback) {
    if (typeof query === 'undefined') return callback(new Error('Не заданы параметры поиска'));
    if (typeof opts === 'function') callback = opts;
    if (typeof callback === 'undefined') throw new Error('Отсутствует замыкание функции');

    const base = options.base || 'ou=people,dc=briskhome,dc=com';
    const scope = options.scope || 'sub';
    const filter = query.charAt[0] === '(' ? query : `(cn=${query})`;
    const sizeLimit = options.sizeLimit || 0;

    return this.client.search(base, { filter, scope, sizeLimit }, (err, res) => {
      if (err) {
        log.error(err);
        return callback(err);
      }

      res.on('error', (searchErr) => {
        log.error({ err: searchErr });
        return callback(searchErr);
      });

      res.on('searchEntry', (data) => {
        callback(null, data.object);
      });

      return null;
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
  Ldap.prototype.findOne = function findOne(query, opts, callback) {
    if (typeof query === 'undefined') return callback(new Error('Не заданы параметры поиска'));
    if (typeof opts === 'function') callback = opts;
    if (typeof callback === 'undefined') throw new Error('Отсутствует замыкание функции');

    return this.find(query, { sizeLimit: 1 }, callback);
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

    return this.client.add(dn, entry, (err) => {
      if (err) {
        log.error(err);
        return callback(err);
      }

      return callback(null, true);
    });
  };

  register(null, { ldap: new Ldap() });
};