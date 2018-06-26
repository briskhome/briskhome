/**
 * @briskhome
 * └core.log <specs/index.spec.js>
 */

import plugin from '../';
import Agenda from 'agenda';
import { EventEmitter } from 'events';
import { mockJob } from '../__mocks__/agenda';

jest.mock('agenda');

const options = {};
const imports = {
  db: { connections: [{}] },
  bus: new EventEmitter(),
  log: () => log,
};

const log = {
  trace: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
};

describe('core.agenda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register event handlers', async () => {
    const result = await plugin(options, imports);
    expect(result).toBeInstanceOf(Agenda);
    expect(result).toBe(Agenda.mock.instances[0]);
    expect(Agenda.mock.instances[0].on.mock.calls).toHaveLength(3);
  });

  xit('should register error callback', async () => {
    await plugin(options, imports);
    Agenda.mock.instances[0].listeners['error'][0](new Error());
    // TODO: Assertion on error callback
  });

  it('should define a job', async () => {
    await plugin(options, imports);
    expect(Agenda.mock.instances[0].define.mock.calls).toHaveLength(1);
  });

  it('should schedule a job', async () => {
    await plugin(options, imports);
    expect(Agenda.mock.instances[0].every.mock.calls).toHaveLength(1);
  });

  it('should start when the app is ready', async () => {
    await plugin(options, imports);
    imports.bus.emit('core:ready');
    expect(Agenda.mock.instances[0].start).toHaveBeenCalled();
    expect(log.debug).toHaveBeenCalled();
    expect(log.trace).toHaveBeenCalled();
  });

  it('should run a job', async () => {
    await plugin(options, imports);
    const mockDone = jest.fn();
    const [unused, job] = Agenda.mock.instances[0].define.mock.calls[0];
    job(mockJob, mockDone);
    expect(mockDone).toHaveBeenCalled();
  });
});
