/**
 * @briskhome
 * └core.db <specs/index.spec.js>
 */

import events from 'events';
import mongoose from 'mongoose';
import { resources } from '../../utilities/resources';

import plugin from '../';

jest.unmock('../');
jest.unmock('mongoose');

describe('core.db', () => {
  let sut;
  let options;
  let imports;

  const loader = { load: jest.fn() };
  const config = jest.fn();
  const log = () => ({
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  });

  const mockError = new Error('MockError');

  beforeEach(async (done) => {
    options = {};
    imports = { config, loader, log };

    config.mockReturnValueOnce({
      database: 'test',
      hostname: 'test',
      username: 'test',
      password: 'test',
    });

    resources.mockReturnValueOnce([]);
    mongoose.connection.close(() => done());
  });

  it.skip('returns error when unable to connect', () => {
    plugin(options, imports, (error) => {
      expect(error).toEqual(mockError);
    });
    mongoose.connection.emit('error', mockError);
    mongoose.connection.close();
  });

  it.skip('should register', () => {
    plugin(options, imports, (error, exports) => {
      expect(error).toBe(null);
      expect(Object.keys(exports)).toEqual(['db']);
    });
    mongoose.connection.emit('open', mockError);
    mongoose.connection.close();
  });
});
