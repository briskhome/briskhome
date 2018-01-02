/**
 * @briskhome
 * └core.db <__tests__/index.test.js>
 */

import plugin from '../';
import mongoose from 'mongoose';
import mockLog from 'core.log/__mocks__/index.mock.js';

jest.unmock('../');
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
  },
}));
jest.mock('utilities/resources', () => ({ resources: () => [] }));

describe('core.db', () => {
  let options;
  let imports;

  const mockBus = { on: jest.fn(), emit: jest.fn() };
  const loader = { load: jest.fn() };
  const config = jest.fn();

  const mockError = new Error('MockError');

  beforeEach(() => {
    jest.clearAllMocks();
    options = { uri: 'mongodb://localhost:27017/' };
    imports = { bus: mockBus, config, loader, log: mockLog };
  });

  it('connected', async done => {
    plugin(options, imports, (...data) => {
      const [error, db] = data;
      expect(error).toBeNull();
      expect(db).toBeTruthy();
      done();
    });

    mongoose.connection.once.mock.calls.filter(
      ([name]) => name === 'connected',
    )[0][1]();
  });

  it('error', async done => {
    plugin(options, imports, (...data) => {
      const [error] = data;
      expect(error).toEqual(mockError);
      done();
    });

    mongoose.connection.on.mock.calls.filter(
      ([name]) => name === 'error',
    )[0][1](mockError);
  });

  it('error when ready', async done => {
    plugin(options, imports, (...data) => {
      const [error] = data;
      expect(error).toEqual(mockError);
      done();
    });

    mockBus.on.mock.calls[0][1]();
    mongoose.connection.on.mock.calls.filter(
      ([name]) => name === 'error',
    )[0][1](mockError);
  });

  it('connecting', async done => {
    plugin(options, imports, (...data) => {
      const [error, db] = data;
      expect(error).toBeNull();
      expect(db).toBeDefined();
      done();
    });

    mongoose.connection.on.mock.calls.filter(
      ([name]) => name === 'connecting',
    )[0][1]();
    mongoose.connection.once.mock.calls.filter(
      ([name]) => name === 'connected',
    )[0][1]();
  });

  it('disconnecting', async done => {
    plugin(options, imports, (...data) => {
      const [error, db] = data;
      expect(error).toBeNull();
      expect(db).toBeDefined();
      done();
    });

    mongoose.connection.on.mock.calls.filter(
      ([name]) => name === 'disconnecting',
    )[0][1]();
    mongoose.connection.once.mock.calls.filter(
      ([name]) => name === 'connected',
    )[0][1]();
  });

  it('disconnected', async done => {
    plugin(options, imports, (...data) => {
      const [error, db] = data;
      expect(error).toBeNull();
      expect(db).toBeDefined();
      done();
    });

    mongoose.connection.on.mock.calls.filter(
      ([name]) => name === 'disconnected',
    )[0][1]();
    mongoose.connection.once.mock.calls.filter(
      ([name]) => name === 'connected',
    )[0][1]();
  });

  it('reconnected', async done => {
    plugin(options, imports, (...data) => {
      const [error, db] = data;
      expect(error).toBeNull();
      expect(db).toBeDefined();
      done();
    });

    mongoose.connection.on.mock.calls.filter(
      ([name]) => name === 'reconnected',
    )[0][1]();
    mongoose.connection.once.mock.calls.filter(
      ([name]) => name === 'connected',
    )[0][1]();
  });
});
