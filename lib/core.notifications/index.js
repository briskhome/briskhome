/**
 * @briskhome/core.notifications
 * <lib/core.notifications/index.js>
 *
 * Компонент управления подписками.
 *
 * @author  Егор Зайцев <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function setup(options, imports, register) {
  const db = imports.db;
  const bus = imports.bus;
  const log = imports.log('notifications');
  const users = imports.users;

  const Event = db.model('core.event');

  /**
   * @constructor
   */
  function NotificationsManager() {
    this.registeredNotifications = [];
  }

  NotificationsManager.prototype.init = function init() {

  };

  NotificationsManager.prototype.update = function update() {

  };

  /**
   * Регистрация события
   */
  NotificationsManager.prototype.register = function register(event) {
    // 1. Сохранить запись а базу данных
    // 2. Подписаться на уведомление
    bus.on(event.name, () => {});
  };

  /**
   * Метод NotificationsManager#subscribe подписывает пользователя системы на определенное событие
   * или категорию событий путем создания соответствующей записи в коллекции базы данных, содержащей
   * сведения о зарегистрированных подписках.
   *
   * @param {String} notification  Идентификатор события, на которые следует осуществить подписку;
   * @param {String} username      Имя пользователя, которого следует подписать на событие.
   *
   * @callback cb
   */
  NotificationsManager.prototype.subscribe = function subscribe(notification, username, cb) {
    // if (this.notifications.indexOf(notification) < 0) {
    //   const notRegisteredMsg = `Событие ${notification} не зарегистрировано`;
    //   const notRegisteredErr = new Error(notRegisteredMsg);
    //   log.warn({ err: notRegisteredErr },
    //     'Попытка подписки на незарегистрированное событие'
    //   );
    //
    //   return cb(notRegisteredErr);
    // }

    return users.findOne(username, (userFindErr, userFindRes) => {
      if (userFindErr) {
        log.warn({ err: userFindErr },
          'Ошибка при выполнении запроса в базу данных'
        );

        return cb(userFindErr);
      }

      if (!userFindRes) {
        const noSuchUserMsg = `Пользователь ${username} не зарегистрирован`;
        const noSuchUserErr = new Error(noSuchUserMsg);
        log.warn({ err: noSuchUserErr },
          'Попытка подписки от незарегистрированного пользователя'
        );

        return cb(userFindErr);
      }

      return Event.findOne({ _id: notification }, (subFindErr, subFindRes) => {
        if (subFindErr) {
          log.warn({ err: subFindErr },
            'Ошибка при выполнении запроса в базу данных'
          );

          return cb(subFindErr);
        }

        if (!subFindRes) {
          const noSuchSubMsg = `Событие ${notification} не зарегистрировано`;
          const noSuchSubErr = new Error(noSuchSubMsg);
          log.warn({ err: noSuchSubErr },
            'Попытка подписки на незарегистрированное событие'
          );
        }

        subFindRes.listeners.push(username);
        return subFindRes.save((subSaveErr) => {
          if (subSaveErr) {
            log.warn({ err: subSaveErr },
              'Ошибка при выполнении запроса в базу данных'
            );

            return cb(subFindErr);
          }

          return cb(null);
        });
      });
    });
  };

  NotificationsManager.prototype.unsubscribe = function unsubscribe(notification, username, cb) {

  };

  register({ notifications: new NotificationsManager() });
};
