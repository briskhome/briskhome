/**
 * @briskhome
 * └core.notifications <lib/core.notifications/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const {
  ERR_UNABLE_TO_FETCH,
  ERR_UNABLE_TO_REGISTER,
  ERR_UNABLE_TO_SUBSCRIBE,
  ERR_UNABLE_TO_UNSUBSCRIBE,
  ERR_NO_EVENT,
  ERR_NO_CONTACTS,
  ERR_NO_SUBSCRIBERS,
  ERR_NO_SUCH_PROVIDER,
  EVENT_DISPATCH_FAILURE,
  EVENT_DISPATCH_SUCCESS,
  EVENT_REGISTER_SUCCESS,
  EVENT_UPDATE_SUCCESS
} = require('./constants.js');

module.exports = function setup (options, imports, register) {
  const db = imports.db;
  const bus = imports.bus;
  const log = imports.log();

  const EventModel = db.model('core:event');
  const UserModel = db.model('core:user');

  /**
   * @constructor
   */
  function NotificationsManager () {
    this.providers = {};
  }

  NotificationsManager.prototype.init = function init () {
    /* load installed providers
     * recreate listeners for every event
     * TODO: move subscribing to event to 'register' function since it is called on every
     * init and subscriptions are not. watch closely for exactly 1 listener per event!
     */
  };

  NotificationsManager.prototype.update = function update () {

  };

  /**
   * @async #register()
   * Register an event definition.
   *
   * @param  {Object} payload
   * @param  {String} payload.id           Unique event identifier.
   * @param  {String} payload.name         Human-readable name of the event.
   * @param  {String} payload.description  Human-readable description of the event.
   * @return {Boolean}
   */
  NotificationsManager.prototype.register = async function register (payload) {
    const { id, name, description } = payload;
    const component = `${new Error().stack.split('\n')[2].split('/').slice(-2, -1)}`;
    let event;

    try {
      event = await EventModel.fetchById(id);
    } catch (e) {
      log.error({ err: e, payload }, ERR_UNABLE_TO_FETCH);
      return false;
    }

    if (!bus.listenerCount(id)) {
      log.trace(`adding listener for event ${id}`);
      bus.on(id, (id) => Function.prototype.call(this.evaluate, id));
    }

    if (event) {
      // TODO: Updating event properly
      event.update({ id }, { name, description, component });
      log.debug({ payload }, EVENT_UPDATE_SUCCESS);
    } else {
      event = new EventModel({ _id: id, name, description, component });
      try {
        await event.save();
        log.debug({ payload }, EVENT_REGISTER_SUCCESS);
      } catch (e) {
        log.error({ err: e, payload }, ERR_UNABLE_TO_REGISTER);
        return false;
      }
    }

    return true;
  };

  /**
   * @async #subscribe()
   * Subscribes user to notifications about a particular event.
   *
   * @param  {Object} payload
   * @param  {String} payload.event     Unique registered event identifier.
   * @param  {String} payload.levels    Event levels user should be subscribed to.
   * @param  {String} payload.username  Unique registered user identifier.
   * @return {Boolean}
   */
  NotificationsManager.prototype.subscribe = async function subscribe (payload) {
    const { event, username } = payload;
    const levels = payload.levels || [30, 50, 60]; // info, error & fatal

    let user;
    try {
      user = await UserModel.fetchByUsername(username);
    } catch (e) {
      log.error({ err: e, payload }, ERR_UNABLE_TO_SUBSCRIBE);
      return false;
    }

    user.subscriptions.push({ _id: event, levels });
    user.markModified('subscriptions');
    try {
      await user.save();
    } catch (e) {
      log.error({ err: e, payload }, ERR_UNABLE_TO_SUBSCRIBE);
      return false;
    }

    return true;
  };

  /**
   * @async #unsubscribe()
   * Unsubscribe user from a particular notification.
   *
   * @param  {String} payload
   * @param  {String} payload.event     Unique registered event identifier.
   * @param  {String} payload.username  Unique registered user identifier.
   * @return {Boolean}
   */
  NotificationsManager.prototype.unsubscribe = async function unsubscribe (payload) {
    const { event, username } = payload;

    let user, subscribers;
    try {
      user = await UserModel.fetchByUsername(username);
      subscribers = await UserModel.fetchBySubscription(event);
    } catch (e) {
      log.error({ err: e, payload }, ERR_UNABLE_TO_UNSUBSCRIBE);
      return false;
    }

    // Change to Array#filter()
    const index = user.subscriptions.indexOf(event);
    user.subscriptions.splice(index, 1);
    user.markModified('subscriptions');

    try {
      await user.save();
    } catch (e) {
      log.error({ err: e, payload }, ERR_UNABLE_TO_UNSUBSCRIBE);
      return false;
    }

    if (subscribers.length === 1) {
      bus.removeListener(event, (event) => Function.prototype.call(this.evaluate, event));
    }

    return true;
  };

  /**
   * @async #evaluate()
   * Evaluates an event and decides whether to send out notifications.
   *
   * @param {Object} id  Unique registered event identifier.
   */
  NotificationsManager.prototype.evaluate = async function evaluate (id) {
    log.trace({ data: id });
    let event, users;
    try {
      event = await EventModel.fetchById(id);
      users = await UserModel.fetchBySubscription(id);
    } catch (e) {
      log.error({ err: e }, ERR_UNABLE_TO_FETCH);
      return;
    }

    if (!event) {
      log.debug({ data: id }, ERR_NO_EVENT);
      bus.removeListener(id, (id) => Function.prototype.call(this.evaluate, id));
      return;
    }

    if (!users.length) {
      log.debug({ data: id }, ERR_NO_SUBSCRIBERS);
      bus.removeListener(id, (id) => Function.prototype.call(this.evaluate, id));
      return;
    }

    users.map(user => {
      const hasMatchingSubscription = !!user.subscriptions.filter(subscription => {
        return subscription.id === event.id && subscription.levels.includes(event.level);
      }).length;

      if (!hasMatchingSubscription) {
        return;
      }

      if (user.contacts) {
        user.contacts
          .filter(contact => {
            return contact.levels.includes(event.level);
          })
          .map(async (contact) => {
            if (!this.providers[contact.name]) {
              log.warn({ data: { event, user, contact } }, ERR_NO_SUCH_PROVIDER);
              return;
            }

            try {
              await this.providers[contact.name].send(event);
            } catch (e) {
              log.warn({ data: { user, event, contact } }, EVENT_DISPATCH_FAILURE);
              return;
            }

            log.info({ data: { user, event, contact } }, EVENT_DISPATCH_SUCCESS);
          });
      } else {
        log.warn({ data: { user, event } }, ERR_NO_CONTACTS);
      }
    });
  };

  NotificationsManager.levels = {
    TRACE: 10,
    DEBUG: 20,
    INFO: 30,
    WARN: 40,
    ERROR: 50,
    FATAL: 60
  };

  register(null, { notifications: new NotificationsManager() });
};
