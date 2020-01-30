/**
 * @briskhome
 * └core.bus
 */
import plugin from "../";
import EventEmitter from 'eventemitter2';
jest.mock('eventemitter2');
const options = {};
const imports = {
  log: () => log
};
const mockEvent = {
  name: 'mockEvent'
};
const log = {
  trace: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn()
};
describe('core.bus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should register', async () => {
    const result = await plugin(imports, options);
    expect(result).toBeInstanceOf(EventEmitter);
    expect(EventEmitter.mock.instances).toHaveLength(1);
    expect(EventEmitter.mock.instances[0].on.mock.calls).toHaveLength(2);
  });
  it('should process a core event', async () => {
    const result = await plugin(imports, options);
    expect(result).toBeInstanceOf(EventEmitter);
    EventEmitter.mock.instances[0].listeners['core:**'][0](mockEvent);
    expect(log.trace).toHaveBeenCalled();
  });
  it('should process a broadcast event', async () => {
    const result = await plugin(imports, options);
    expect(result).toBeInstanceOf(EventEmitter);
    EventEmitter.mock.instances[0].listeners['broadcast:**'][0](mockEvent);
    expect(log.trace).toHaveBeenCalled();
  });
});