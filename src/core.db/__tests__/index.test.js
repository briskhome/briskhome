/**
 * @briskhome
 * └core.db <__tests__/index.test.js>
 */

import plugin from '../';
import mongoose from 'mongoose';
import log from 'core.log/__mocks__/index.mock.js';

jest.mock('mongoose');

const options = { uri: 'mongodb://localhost:27017/' };
const imports = {
  app: { load: jest.fn() },
  bus: { on: jest.fn(), emit: jest.fn() },
  config: jest.fn(),
  log,
};

const mockError = new Error('MockError');

describe('core.db', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('connected', async () => {
    const result = await plugin(imports, options);
    expect(mongoose.connect).toHaveBeenCalled();
    expect(mongoose.connection.on).toHaveBeenCalledTimes(6);
    expect(imports.app.load).toHaveBeenCalled();
  });

  it('error', async () => {
    const result = plugin(imports, options);
    mongoose.listeners['error'][0](mockError);
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('error when ready', async () => {
    const result = plugin(imports, options);
    imports.bus.on.mock.calls[0][1]();
    mongoose.listeners['error'][0](mockError);
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('connecting', async () => {
    const result = plugin(imports, options);
    mongoose.listeners['connecting'][0]();
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('disconnecting', async () => {
    const result = plugin(imports, options);
    mongoose.listeners['disconnecting'][0]();
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('disconnected', async () => {
    const result = plugin(imports, options);
    mongoose.listeners['disconnected'][0]();
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('reconnected', async () => {
    const result = plugin(imports, options);
    mongoose.listeners['reconnected'][0]();
    expect(mongoose.connect).toHaveBeenCalled();
  });
});
