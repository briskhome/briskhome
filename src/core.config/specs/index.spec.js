/* globals jest describe beforeAll beforeEach it expect */
import nconf from 'nconf';
import properties from 'properties';

import plugin from '../';

jest.unmock('../');

describe('core.bus', () => {
  let sut;
  let options;
  let imports;

  const loader = { load: jest.fn() };

  const fakeConfig = { test: 'test'};

  beforeEach(() => {
    options = {};
    imports = { loader };

    loader.load.mockReturnValue(['test']);
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
