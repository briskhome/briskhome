/**
 * @briskhome/core.users <lib/core.users/index.js>
 *
 * Компонент управления пользователями системы.
 *
 * @author  Егор Зайцев <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function setup(options, imports, register) {
  function User() {
    //
  }

  /**
   * Метод User.find() осуществляет поиск сведений о нескольких пользователях системы, подходящих
   * под заданные условия поиска.
   * @static
   *
   * @param {String} id
   */
  User.find = function find() {
    //
  };

  User.findOne = function findOne() {
    //
  };

  User.insert = function insert() {
    //
  };

  User.prototype.remove = function remove() {
    //
  };

  User.prototype.update = function update() {
    //
  };

  register({ users: User });
};
