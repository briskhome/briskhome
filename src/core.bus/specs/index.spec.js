/* globals jest describe beforeAll beforeEach it expect */
import events from 'events';
// import { Server } from 'mosca';

import plugin from '../';

jest.enableAutomock();
jest.unmock('../');
jest.unmock('mosca');

describe('core.bus', () => {
  let options;
  let imports;
  const db = {};
  const log = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };
  const config = jest.fn();

  class MockMQTTServer extends events.EventEmitter {}

  beforeAll(() => {
    config.mockReturnValueOnce({
      username: 'test',
      password: 'test',
      hostname: 'test',
      database: 'test',
    });

    options = {};
    imports = { db, log, config };

    Server.mockReturnValueOnce(MockMQTTServer);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.skip('should register', () => {
    plugin(options, imports, (err, exports) => {
      expect(err).toBe(null);
      expect(Object.keys(exports)).toEqual(['config']);
    });
  });
});

// require('../')(options, imports, (error, returns) => {
//   const bus = returns.bus;
//
//   it('should transmit events', function (done) {
//     const foo = { foo: 'bar' };
//     bus.once('foo', (data) => {
//       assert.equal(data, foo);
//       assert.calledOnce(logInfoStub);
//       logInfoStub.reset();
//       return done();
//     });
//
//     bus.emit('foo', foo);
//   });
// });
