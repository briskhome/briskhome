/**
 * @briskhome
 * └core.log <specs/index.spec.js>
 */

import bunyan from 'bunyan';
import { getCallee, normalizeName } from '../../utilities/helpers';
import plugin from '../';

jest.unmock('../');

describe('core.log', () => {
  let sut;
  let options;
  let imports;

  const config = jest.fn();
  const log = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    child: jest.fn(),
  };

  beforeEach(() => {
    config.mockReturnValueOnce({
      username: 'test',
      password: 'test',
      hostname: 'test',
      database: 'test',
    });

    options = {};
    imports = { config };
  });

  beforeEach(() => {
    bunyan.createLogger.mockReturnValueOnce(log);
    normalizeName.mockReturnValueOnce('core.log');
    getCallee.mockReturnValueOnce('@briskhome/core.log');
    log.child.mockReturnValueOnce(log);
  });

  it('should register', async () => {
    plugin(options, imports, (err, exports) => {
      expect(err).toBe(null);
      expect(Object.keys(exports)).toEqual(['log']);
    });
  });

  it('should return child logger', async () => {
    plugin(options, imports, (err, exports) => {
      exports.log();
      expect(log.child).toHaveBeenCalledTimes(1);
      expect(log.child).toHaveBeenCalledWith({ component: 'core.log' });
    });
  });
});
