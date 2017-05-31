/** @flow
 * @briskhome
 * └core.notifications <lib/core.notifications/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

import uuid from 'uuid-1345';
import { requireResources } from '../components';
import {
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
  EVENT_UPDATE_SUCCESS,
} from './constants';

import type { CoreImports, CoreRegister, SubscriptionType } from '../utilities/coreTypes';
import type { EventModelType, EventType } from './models/EventModel';
import type { UserModelType } from '../core.db/models/UserModel';

module.exports = function setup(options: Object, imports: CoreImports, register: CoreRegister) {
  const db = imports.db;
  const bus = imports.bus;
  const log = imports.log();

  const EventModel: EventModelType = db.model('core:event');
  const UserModel: UserModelType = db.model('core:user');

  /**
   * @constructor
   */
  function Notifications() {
    this.providers = {};

    this.init();
  }

  Notifications.prototype.init = function init()
    : void {
    /* load installed providers
     * recreate listeners for every event
     * TODO: move subscribing to event to 'register' function since it is called on every
     * init and subscriptions are not. watch closely for exactly 1 listener per event!
     */
  };

  Notifications.prototype.update = function update()
    : void {

  };

  /**
   * @async #define()
   * Registers an event definition.
   *
   * @param  {Object} data
   * @param  {String} data.id           Unique event identifier.
   * @param  {String} data.name         Human-readable name of the event.
   * @param  {String} data.description  Human-readable description of the event.
   * @return {Boolean}
   */
  Notifications.prototype.define = async function define(data: EventType)
    : Promise<boolean> {
    const { id, name, description } = data;
    const component = String(new Error().stack.split('\n')[2].split('/').slice(-2, -1));
    let event;

    try {
      event = await EventModel.fetchById(id);
    } catch (e) {
      log.error({ err: e, data }, ERR_UNABLE_TO_FETCH);
      return false;
    }

    if (!bus.listenerCount(id)) {
      log.trace(`adding listener for event ${id}`);
      bus.on(id, (...definition) => Function.prototype.apply(this.evaluate, definition));
    }

    if (event) {
      /* TODO: Add static method to EventModel to update event properly */
      event.update({ id }, { name, description, component });
      log.debug({ data }, EVENT_UPDATE_SUCCESS);
    } else {
      event = new EventModel({ id, name, description, component });
      try {
        await event.save();
        log.debug({ data }, EVENT_REGISTER_SUCCESS);
      } catch (e) {
        log.error({ err: e, data }, ERR_UNABLE_TO_REGISTER);
        return false;
      }
    }

    return true;
  };

  /**
   * @async #subscribe()
   * Subscribes user to notifications about a particular event.
   *
   * @param  {Object} data
   * @param  {String} data.event     Unique registered event identifier.
   * @param  {String} data.levels    Event levels user should be subscribed to.
   * @param  {String} data.username  Unique registered user identifier.
   * @return {Boolean}
   */
  Notifications.prototype.subscribe = async function subscribe(data: SubscriptionType)
    : Promise<boolean> {
    const { eventId, username } = data;
    const levels = data.levels || [30, 50, 60]; // info, error & fatal

    let user;
    try {
      user = await UserModel.fetchByUsername(username);
    } catch (e) {
      log.error({ err: e, data }, ERR_UNABLE_TO_SUBSCRIBE);
      return false;
    }

    user.subscriptions.push({ _id: eventId, levels });
    user.markModified('subscriptions');
    try {
      await user.save();
    } catch (e) {
      log.error({ err: e, data }, ERR_UNABLE_TO_SUBSCRIBE);
      return false;
    }

    return true;
  };

  /**
   * @async #unsubscribe()
   * Unsubscribe user from a particular notification.
   *
   * @param  {String} data
   * @param  {String} data.eventId     Unique registered event identifier.
   * @param  {String} data.username    Unique registered user identifier.
   * @return {Boolean}
   */
  Notifications.prototype.unsubscribe = async function unsubscribe(data: SubscriptionType)
    : Promise<boolean> {
    const { eventId, username } = data;

    let user;
    let subscribers;

    try {
      user = await UserModel.fetchByUsername(username);
      subscribers = await UserModel.fetchBySubscription(eventId);
    } catch (e) {
      log.error({ err: e, data }, ERR_UNABLE_TO_UNSUBSCRIBE);
      return false;
    }

    // Change to Array#filter()
    const index = user.subscriptions.indexOf(eventId);
    user.subscriptions.splice(index, 1);
    user.markModified('subscriptions');

    try {
      await user.save();
    } catch (e) {
      log.error({ err: e, data }, ERR_UNABLE_TO_UNSUBSCRIBE);
      return false;
    }

    if (subscribers.length === 1) {
      bus.removeListener(eventId, a => Function.prototype.apply(this.evaluate, a));
    }

    return true;
  };

  /**
   * @async #evaluate()
   * Evaluates an event and decides whether to send out notifications.
   *
   * @param {Object} id  Unique registered event identifier.
   */
  Notifications.prototype.evaluate = async function evaluate(id: string): Promise<> {
    log.trace({ data: id });

    let event;
    let users;

    try {
      event = await EventModel.fetchById(id);
      users = await UserModel.fetchBySubscription(id);
    } catch (e) {
      log.error({ err: e }, ERR_UNABLE_TO_FETCH);
      return;
    }

    if (!event) {
      log.debug({ data: id }, ERR_NO_EVENT);
      bus.removeListener(id, a => Function.prototype.apply(this.evaluate, a));
      return;
    }

    if (!users.length) {
      log.debug({ data: id }, ERR_NO_SUBSCRIBERS);
      bus.removeListener(id, a => Function.prototype.apply(this.evaluate, a));
      return;
    }

    users.forEach((user) => {
      const hasMatchingSubscription = !!user.subscriptions.filter((subscription) => {
        return subscription.id === event.id && subscription.levels.includes(event.level);
      }).length;

      if (!hasMatchingSubscription) {
        return false;
      }

      if (user.contacts) {
        user.contacts
          .filter(contact => contact.levels.includes(event.level))
          .map(async (contact) => {
            if (!this.providers[contact.name]) {
              log.warn({ data: { event, user, contact } }, ERR_NO_SUCH_PROVIDER);
              return;
            }

            try {
              await this.providers[contact.name].send({ id: contact.id, event });
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

  /**
   * @async #verify()
   * Performs user account verification for provider.
   *
   * @param  {UserType} user     [description]
   * @param  {String}    providerId [description]
   * @return {String}  A link or action that needs to be followed in order to verify.
   */
  Notifications.prototype.verify = async function verify(user: UserModelType, providerId: string)
    : Promise<> {
    const verified = async (contactId) => {
      user.contacts[providerId] = contactId;                                  // eslint-disable-line
      const result = await user.save();
      if (!result) {
        log.error(`Unable to verify ${user.username} with ${providerId} by ${contactId}`);
      }
    };

    if (!Object.keys(this.providers).includes(providerId)) {
      log.error(`Notifications provider with providerId ${providerId} not found`);
      return null;
    }

    const token = uuid.v4();
    return this.providers[providerId](token, verified);
  };

  /**
   * [providers description]
   * @return {Array}
   */
  Notifications.prototype.providers = async function providers()
    :Promise<Array<*>> {
    return requireResources('providers');
  };

  Notifications.levels = {
    TRACE: 10,
    DEBUG: 20,
    INFO: 30,
    WARN: 40,
    ERROR: 50,
    FATAL: 60,
  };

  register(null, { notifications: new Notifications() });
};
