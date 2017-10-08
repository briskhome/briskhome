/**
 * @briskhome
 * └core.log <specs/index.spec.js>
 */

import plugin from '../';
import Agenda from 'agenda';
import { EventEmitter } from 'events';

jest.mock('agenda');

describe('core.agenda', () => {
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

  const mockCb = jest.fn();
  const mockJob = { attrs: { name: 'mockJob' } };
  const mockError = new Error('mockError');

  beforeEach(() => {
    jest.resetAllMocks();

    options = {};
    imports = {
      db: { connections: [{}] },
      bus: new EventEmitter(),
      log: () => log,
    };
  });

  it('should register a service', async done => {
    plugin(options, imports, (...result) => {
      const [error, services] = result;
      imports.bus.emit('core:ready');
      expect(error).toBeNull();
      expect(services.agenda).toBeInstanceOf(Agenda);
      expect(Agenda.mock.instances[0].start).toHaveBeenCalled();
      return done();
    });

    expect(Agenda.mock.instances[0].on.mock.calls.length).toBe(3);
    Agenda.mock.instances[0].on.mock.calls[2][1]();
  });

  it('should register an error', async done => {
    plugin(options, imports, (...result) => {
      const [error, services] = result;
      expect(error).toEqual(mockError);
      expect(services).toBeUndefined();
      return done();
    });

    expect(Agenda.mock.instances[0].on.mock.calls.length).toBe(3);
    Agenda.mock.instances[0].on.mock.calls[1][1](mockError);
  });

  it('should log events when job starts', async done => {
    plugin(options, imports, () => null);

    expect(Agenda.mock.instances[0].on.mock.calls.length).toBe(3);
    Agenda.mock.instances[0].on.mock.calls[0][1](mockJob);
    expect(log.debug).toHaveBeenCalledWith(
      { job: mockJob.attrs.name },
      'Starting job',
    );
    expect(log.trace).toHaveBeenCalledWith({ job: mockJob });
    return done();
  });

  it('should process poll job definition', async done => {
    plugin(options, imports, () => null);

    expect(Agenda.mock.instances[0].define.mock.calls.length).toBe(1);
    Agenda.mock.instances[0].define.mock.calls[0][1](mockJob, mockCb);
    expect(mockCb).toHaveBeenCalled();
    return done();
  });
});
