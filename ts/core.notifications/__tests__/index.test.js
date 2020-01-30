/**
 * @briskhome
 * └core.notifications <specs/index.spec.js>
 */
import { getCallee } from "../../utilities/helpers";
jest.enableAutomock();
jest.unmock("../");

const EventEmitter = require('events').EventEmitter;

import events from 'events';
import { ERR_UNABLE_TO_FETCH, ERR_UNABLE_TO_REGISTER, ERR_UNABLE_TO_SUBSCRIBE, ERR_UNABLE_TO_UNSUBSCRIBE, ERR_NO_EVENT, ERR_NO_CONTACTS, ERR_NO_SUBSCRIBERS, ERR_NO_SUCH_PROVIDER, EVENT_DISPATCH_FAILURE, EVENT_DISPATCH_SUCCESS, EVENT_REGISTER_SUCCESS, EVENT_UPDATE_SUCCESS } from "../constants";
import plugin from "../";
jest.unmock("../");
describe('core.notifications', () => {
  const sut = plugin;
  let options;
  let imports;
  let component;
  const log = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn()
  };
  const db = {
    model: jest.fn()
  };
  const bus = new events.EventEmitter();
  const fetchById = jest.fn();
  const fetchByUsername = jest.fn();
  const fetchBySubscription = jest.fn();
  const mockEventSave = jest.fn();

  function EventModel() {
    this.save = mockEventSave;
  }

  EventModel.fetchById = fetchById;

  function UserModel() {}

  UserModel.fetchBySubscription = fetchBySubscription;
  UserModel.fetchByUsername = fetchByUsername;
  const mockEvent = {
    id: 'foo:bar',
    name: 'Foo Bar',
    description: 'Event Definition',
    level: 30,
    save: jest.fn(),
    update: jest.fn()
  };
  const mockError = new Error('MockError');
  const mockUsers = [{
    id: '111',
    username: 'foo',
    subscriptions: [{
      id: 'foo:bar',
      levels: [30, 40, 50, 60]
    }],
    contacts: [{
      name: 'phone',
      levels: [30],
      value: '+70000000000'
    }],
    markModified: jest.fn(),
    save: jest.fn()
  }, {
    id: '222',
    username: 'bar',
    subscriptions: [{
      id: 'foo:bar',
      levels: [40, 50, 60]
    }],
    contacts: [{
      name: 'telegram',
      levels: [30],
      value: '1234567'
    }],
    markModified: jest.fn(),
    save: jest.fn()
  }];
  beforeEach(() => {
    options = {};
    imports = {
      db,
      bus,
      log: () => log
    };
    db.model.mockReturnValueOnce(EventModel);
    db.model.mockReturnValueOnce(UserModel);
    getCallee.mockReturnValueOnce('core.notifications');
    component = sut(imports, options);
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('#define()', () => {
    const mockPayload = {
      id: '000000-0000-0000-000000',
      name: 'notifications:randomEvent',
      description: 'Some random event that happens during tests'
    };
    beforeEach(() => {
      EventModel.fetchById.mockReturnValue(Promise.resolve(mockEvent));
      mockEvent.update.mockReturnValue(true);
      mockEventSave.mockReturnValue(true);
    });
    it('returns false when unable to fetch events', async () => {
      EventModel.fetchById.mockReturnValue(Promise.reject(mockError));
      const res = await component.define(mockPayload);
      expect(res).toEqual(false);
      expect(log.error).toHaveBeenCalledWith({
        err: mockError,
        data: mockPayload
      }, ERR_UNABLE_TO_FETCH);
    });
    it('returns false when unable to save event', async () => {
      fetchById.mockReturnValueOnce(Promise.resolve(null));
      mockEventSave.mockReturnValueOnce(Promise.reject(mockError));
      const res = await component.define(mockPayload);
      expect(res).toEqual(false);
      expect(mockEventSave).toHaveBeenCalled();
      expect(log.error).toHaveBeenCalledWith({
        err: mockError,
        data: mockPayload
      }, ERR_UNABLE_TO_REGISTER);
    });
    it('updates existing event definition when one exists', async () => {
      const res = await component.define(mockPayload);
      expect(res).toEqual(true);
      expect(mockEvent.update).toHaveBeenCalled();
      expect(log.debug).toHaveBeenCalledWith({
        data: mockPayload
      }, EVENT_UPDATE_SUCCESS);
    });
    it('creates an event definition when one does not exist', async () => {
      fetchById.mockReturnValueOnce(Promise.resolve(null));
      const res = await component.define(mockPayload);
      expect(res).toEqual(true);
      expect(mockEventSave).toHaveBeenCalled();
      expect(log.debug).toHaveBeenCalledWith({
        data: mockPayload
      }, EVENT_REGISTER_SUCCESS);
    });
  });
  describe('#subscribe()', () => {
    const mockPayload = {
      event: {
        id: 'foo:bar'
      },
      user: {
        username: 'foo'
      }
    };
    beforeEach(() => {
      fetchByUsername.mockReturnValue(Promise.resolve(mockUsers[0]));
      mockUsers[0].markModified.mockReturnValue(true);
      mockUsers[0].save.mockReturnValue(true);
      bus.removeAllListeners(mockPayload.event.id);
    });
    it('returns false when unable to subscribe user', async () => {
      fetchByUsername.mockReturnValue(Promise.reject(mockError));
      const res = await component.subscribe(mockPayload);
      expect(res).toEqual(false);
      expect(log.error).toHaveBeenCalledWith({
        err: mockError,
        data: mockPayload
      }, ERR_UNABLE_TO_SUBSCRIBE);
    });
    it('returns false when unable to save user', async () => {
      mockUsers[0].save.mockReturnValue(Promise.reject(mockError));
      const res = await component.subscribe(mockPayload);
      expect(res).toEqual(false);
      expect(log.error).toHaveBeenCalledWith({
        err: mockError,
        data: mockPayload
      }, ERR_UNABLE_TO_SUBSCRIBE);
    });
    it('returns true when subscribes user to notifications', async () => {
      const res = await component.subscribe(mockPayload);
      expect(mockUsers[0].save).toHaveBeenCalled();
      expect(res).toEqual(true);
    });
    it('returns true when subscribes user to notifications and adds listener', async () => {
      bus.on(mockPayload.event.id, () => {});
      const res = await component.subscribe(mockPayload);
      expect(mockUsers[0].save).toHaveBeenCalled();
      expect(res).toEqual(true);
    });
  });
  describe('#unsubscribe()', () => {
    const mockPayload = {
      event: {
        id: 'foo:bar'
      },
      user: {
        username: 'foo'
      }
    };
    beforeEach(() => {
      fetchByUsername.mockReturnValue(Promise.resolve(mockUsers[0]));
      fetchBySubscription.mockReturnValue(Promise.resolve([mockUsers[0]]));
      mockUsers[0].markModified.mockReturnValue(true);
      mockUsers[0].save.mockReturnValue(true);
    });
    it('returns false when unable to fetch user', async () => {
      fetchByUsername.mockReturnValue(Promise.reject(mockError));
      const res = await component.unsubscribe(mockPayload);
      expect(res).toEqual(false);
      expect(log.error).toHaveBeenCalledWith({
        err: mockError,
        data: mockPayload
      }, ERR_UNABLE_TO_UNSUBSCRIBE);
    });
    it('returns false when unable to fetch subscribers', async () => {
      fetchBySubscription.mockReturnValue(Promise.reject(mockError));
      const res = await component.unsubscribe(mockPayload);
      expect(res).toEqual(false);
      expect(log.error).toHaveBeenCalledWith({
        err: mockError,
        data: mockPayload
      }, ERR_UNABLE_TO_UNSUBSCRIBE);
    });
    it('returns false when unable to save user', async () => {
      mockUsers[0].save.mockReturnValue(Promise.reject(mockError));
      const res = await component.unsubscribe(mockPayload);
      expect(res).toEqual(false);
      expect(log.error).toHaveBeenCalledWith({
        err: mockError,
        data: mockPayload
      }, ERR_UNABLE_TO_UNSUBSCRIBE);
    });
    it('returns true when unsubscribes user from notifications', async () => {
      fetchBySubscription.mockReturnValue(Promise.resolve(mockUsers));
      const res = await component.unsubscribe(mockPayload);
      expect(mockUsers[0].save).toHaveBeenCalled();
      expect(res).toEqual(true);
    });
    it('returns true when unsubscribes user from notifications and removes listener', async () => {
      const res = await component.unsubscribe(mockPayload);
      expect(mockUsers[0].save).toHaveBeenCalled();
      expect(res).toEqual(true);
    });
  });
  describe('#evaluate()', () => {
    const mockProvider = {
      send: jest.fn().mockReturnValue(Promise.resolve(true))
    };
    beforeEach(() => {
      fetchById.mockReturnValue(Promise.resolve(mockEvent));
      fetchByUsername.mockReturnValue(Promise.resolve(mockUsers[0]));
      fetchBySubscription.mockReturnValue(Promise.resolve([mockUsers[0]]));
      mockUsers[0].markModified.mockReturnValue(true);
      mockUsers[0].save.mockReturnValue(true);
      bus.removeAllListeners(mockEvent.id);
      component.providers.phone = mockProvider;
    });
    it('logs when unable to fetch user', async () => {
      fetchBySubscription.mockReturnValue(Promise.reject(mockError));
      await component.evaluate(mockEvent);
      expect(log.error).toHaveBeenCalledWith({
        err: mockError
      }, ERR_UNABLE_TO_FETCH);
    });
    it('logs when no event fetched', async () => {
      bus.on(mockEvent.id, component.evaluate);
      fetchById.mockReturnValue(Promise.resolve(undefined));
      await component.evaluate(mockEvent);
      expect(log.debug).toHaveBeenCalledWith({
        data: mockEvent
      }, ERR_NO_EVENT);
    });
    it('logs when no subscribers fetched', async () => {
      bus.on(mockEvent.id, component.evaluate);
      fetchBySubscription.mockReturnValue(Promise.resolve([]));
      await component.evaluate(mockEvent);
      expect(log.debug).toHaveBeenCalledWith({
        data: mockEvent
      }, ERR_NO_SUBSCRIBERS);
    });
    it('skips when user is not subscribed to level', async () => {
      const mockUserNoContacts = {
        subscriptions: [{
          id: 'foo:bar',
          levels: [70]
        }]
      };
      fetchBySubscription.mockReturnValue(Promise.resolve([mockUserNoContacts]));
      await component.evaluate(mockEvent);
    });
    it('logs when user has no contacts', async () => {
      const mockUserNoContacts = {
        subscriptions: [{
          id: 'foo:bar',
          levels: [30]
        }]
      };
      fetchBySubscription.mockReturnValue(Promise.resolve([mockUserNoContacts]));
      await component.evaluate(mockEvent.id);
      expect(log.warn).toHaveBeenCalledWith({
        data: {
          user: mockUserNoContacts,
          event: mockEvent
        }
      }, ERR_NO_CONTACTS);
    });
    it('logs when provider not registered', async () => {
      component.providers = {};
      await component.evaluate(mockEvent.id);
      expect(log.warn).toHaveBeenCalledWith({
        data: {
          user: mockUsers[0],
          event: mockEvent,
          contact: mockUsers[0].contacts[0]
        }
      }, ERR_NO_SUCH_PROVIDER);
    });
    it.skip('logs when unable to push notification', async () => {
      mockProvider.send.mockReturnValue(Promise.reject(mockError));
      await component.evaluate(mockEvent.id);
      expect(mockProvider.send).toHaveBeenCalledWith({
        id: mockUsers[0].contacts[0].id,
        event: mockEvent
      });
      expect(log.warn).toHaveBeenCalledWith({
        data: {
          event: mockEvent,
          user: mockUsers[0],
          contact: mockUsers[0].contacts[0]
        }
      }, EVENT_DISPATCH_FAILURE);
    });
    it('logs when notification is sent', async () => {
      await component.evaluate(mockEvent.id);
      expect(mockProvider.send).toHaveBeenCalledWith({
        id: mockUsers[0].contacts[0].id,
        event: mockEvent
      });
      expect(log.info).toHaveBeenCalledWith({
        data: {
          event: mockEvent,
          user: mockUsers[0],
          contact: mockUsers[0].contacts[0]
        }
      }, EVENT_DISPATCH_SUCCESS);
    });
  });
});