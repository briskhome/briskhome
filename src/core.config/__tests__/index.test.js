/**
 * @briskhome
 * └core.config <specs/index.spec.js>
 */
import plugin from '../';
import nconf from 'nconf';

jest.mock('nconf');

const options = {};
const imports = {};

describe('core.config', () => {
  const fakeConfig = { test: 'test' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return configuration provided by nconf', async () => {
    nconf.get.mockReturnValue(fakeConfig);
    const result = await plugin(imports, options);
    expect(result).toBeInstanceOf(Function);
    expect(result()).toEqual(fakeConfig);
  });

  it('should automatically determine plugin name', async () => {
    await plugin(imports, options);
    expect(nconf.get).toHaveBeenCalled();
  });
});
