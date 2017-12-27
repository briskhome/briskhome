/**
 * @briskhome
 * └core.bus
 */

import plugin from '../';
import EventEmitter from 'eventemitter2';

jest.unmock('../');
jest.mock('eventemitter2');

describe('core.bus', () => {
  let sut;
  let options;
  let imports;

  const log = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };

  const mockEvent = { name: 'mockEvent' };

  beforeEach(() => {
    jest.resetAllMocks();

    options = {
      interval: 30000,
    };
    imports = {
      log: () => log,
    };

    sut = plugin;
  });

  it('should register a service', async done => {
    sut(options, imports, (...result) => {
      const [error, services] = result;
      expect(error).toBeNull();
      expect(services.bus).toBeInstanceOf(EventEmitter);

      expect(EventEmitter.mock.instances[0].on.mock.calls.length).toBe(2);
      return done();
    });
  });

  it('should process a broadcast event', async done => {
    sut(options, imports, (...result) => {
      const [error, services] = result;
      expect(error).toBeNull();
      expect(services.bus).toBeInstanceOf(EventEmitter);

      EventEmitter.mock.instances[0].on.mock.calls[0][1](mockEvent);
      expect(log.trace).toHaveBeenCalledWith({ event: undefined }, [mockEvent]);
      return done();
    });
  });

  it('should process a core event', async done => {
    sut(options, imports, (...result) => {
      const [error, services] = result;
      expect(error).toBeNull();
      expect(services.bus).toBeInstanceOf(EventEmitter);

      EventEmitter.mock.instances[0].on.mock.calls[1][1](mockEvent);
      expect(log.trace).toHaveBeenCalledWith({ event: undefined }, [mockEvent]);
      return done();
    });
  });
});
