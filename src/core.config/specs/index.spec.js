/**
 * @briskhome
 * └core.config <specs/index.spec.js>
 */
import nconf from 'nconf';
import properties from 'properties';
import { getCallee } from '../../utilities/helpers';
import { resources } from '../../utilities/resources';

import plugin from '../';

jest.unmock('../');
jest.unmock('../../utilities/helpers');

describe('core.bus', () => {
  let sut;
  let options;
  let imports;

  const fakeConfig = { test: 'test' };

  beforeEach(() => {
    options = {};
    imports = {};
    jest.resetAllMocks();
    resources.mockReturnValue(['test']);
    // getCallee.mockReturnValue('core.config');
  });

  beforeEach(() => {
    plugin(options, imports, (error, exports) => {
      expect(error).toBe(null);
      sut = exports.config;
    });
  });

  it('should return configuration provided by nconf', async () => {
    nconf.get.mockReturnValue(fakeConfig);
    const res = sut();
    expect(res).toEqual(fakeConfig);
  });

  it('should automatically determine plugin name', () => {
    sut();
    expect(nconf.get).toHaveBeenCalledTimes(2);
  });
});
