/**
 * @briskhome
 * └core.ldap <lib/core.ldap/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const ldap = require('ldapjs');

module.exports = function setup(options, imports, register) {
  const log = imports.log('core.ldap');
  const config = imports.config('core.ldap');

  /**
   * @constructor
   */
  function Ldap() {
    log.info('Initializing core.ldap component');

    this.client = ldap.createClient({
      url: `ldap://${config.host}`,
      log,
    });
    this.client.on('connectTimeout', (err) => {
      throw err;
    });

    this.client.on('error', (err) => {
      throw err;
    });

    this.client.on('connect', () => {
      // TODO: Extract tp a separate function.
      // eslint-disable-next-line
      this.client.bind(config.identity, `${config.password}`, function bind(err) {
        if (err) {
          log.fatal(err, 'LDAP bind failed');
          return this.client.unbind();
        }

        log.debug('LDAP bind successful');
      }.bind(this));
    });
  }

  /**
   * #find() performes a search in LDAP and yields found items.
   *
   * @param {String} query  Query string that will be passed to ldapjs
   * @param {Object} opts   Options object that may contain search base, scope, filter or size limit
   * @callback cb
   */
  Ldap.prototype.find = function find(query, opts, cb) {
    if (!query) {
      const noQueryErr = new Error('No query string is provided');
      log.warn({ err: noQueryErr }, noQueryErr.message);
      return cb(noQueryErr);
    }

    const base = options.base || 'ou=people,dc=briskhome,dc=com';
    const scope = options.scope || 'sub';
    const filter = query.charAt[0] === '(' ? query : `(cn=${query})`;
    const sizeLimit = options.sizeLimit || 0;

    return this.client.search(base, { filter, scope, sizeLimit }, (searchErr, searchRes) => {
      if (searchErr) {
        log.error({ err: searchErr }, searchErr.message);
        return cb(searchErr);
      }

      searchRes.on('error', (responseErr) => {
        log.error({ err: responseErr }, responseErr.message);
        return cb(searchErr);
      });

      searchRes.on('searchEntry', (data) => {
        cb(null, data.object);
      });
    });
  };

  /**
   * #findOne()
   *
   * @param {String} query
   * @param {Object} opts
   * @callback callback
   */
  Ldap.prototype.findOne = function findOne(query, opts, callback) {
    return this.find(query, Object.assign(opts, { sizeLimit: 1 }), callback);
  };

  /**
   * #findAndModify()
   */
  Ldap.prototype.findAndModify = function findAndModify() {

  };

  /**
   * #insert()
   */
  Ldap.prototype.insert = function insert(query, opts, callback) {
    if (typeof query === 'undefined') return callback(new Error('Не заданы параметры поиска'));

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
