/* globals jest describe beforeAll beforeEach it expect */
import nconf from 'nconf';
import properties from 'properties';
import { resources } from '../../resources';

import plugin from '../';

jest.unmock('../');

describe('core.bus', () => {
  let sut;
  let options;
  let imports;

  const fakeConfig = { test: 'test' };

  beforeEach(() => {
    options = {};
    imports = {};

    resources.mockReturnValue(['test']);
  });

  beforeEach(() => {
    plugin(options, imports, (error, exports) => {
      expect(error).toBe(null);
      sut = exports.config;
    });
    jest.resetAllMocks();
  });

  it('should return configuration provided by nconf', async () => {
    nconf.get.mockReturnValue(fakeConfig);
    const res = sut();
    expect(res).toEqual(fakeConfig);
  });

  it('should automatically determine plugin name', () => {
    sut();
    expect(nconf.get).toHaveBeenCalledTimes(1);
    expect(nconf.get).toHaveBeenCalledWith('specs');
  });
});
