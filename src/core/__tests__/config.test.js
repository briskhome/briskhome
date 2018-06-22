import fs from 'fs';
import Config from '../lib/config';
import ArchitectError from '../utils/ArchitectError';

jest.mock('fs');
jest.mock('path');

const LIB = {
  './lib/core.example': '',
  './lib/core.example/index.js': 'core.example',
  './lib/core.example/package.json': 'core.example',
};

const NODE_MODULES = {
  './node_modules/briskhome-example': '',
  './node_modules/briskhome-example/index.js': '',
  './node_modules/briskhome-example/package.json': '',
};

describe('core -> config', () => {
  let config;

  beforeEach(() => {
    fs.__setMockFiles({ ...LIB, ...NODE_MODULES });
    config = new Config();
  });

  it('constructor()', () => {
    const directories = ['test'];
    const config = new Config(directories);
    expect(config.directories).toEqual(directories);
  });

  it('async discover()', async () => {
    const result = await config.discover();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(Object.keys(LIB)[0]);
    expect(result[1]).toEqual(Object.keys(NODE_MODULES)[0]);
  });

  it('async prepareExtensions()');
  xdescribe('async getMetadata()', () => {
    it('fails', async () => {
      const res = await config.getMetadata();
    });
  });
  describe('async getRealpath()', () => {
    it('resolves extension (lib)', async () => {
      const base = './lib';
      const name = './core.example';
      const result = await config.getRealpath(base, name);
      expect(result).toBeTruthy();
    });
    it('resolves extension (node_modules)', async () => {
      const base = '.';
      const name = 'briskhome-example';
      const result = await config.getRealpath(base, name);
      expect(result).toBeTruthy();
    });
    it('fails to resolve extension (lib)', async () => {
      const base = './lib';
      const name = './core.invalid';
      try {
        await config.getRealpath(base, name);
      } catch (e) {
        expect(e).toBeInstanceOf(ArchitectError);
      }
    });
    it('fails to resolve extension (node_modules)', async () => {
      const base = '.';
      const name = 'briskhome-invalid';
      try {
        await config.getRealpath(base, name);
      } catch (e) {
        expect(e).toBeInstanceOf(ArchitectError);
      }
    });
  });
  describe('parseExtensions()', () => {
    const packageJson = {
      name: 'package-name',
      dir: '/tmp/briskhome',
      main: '/tmp/briskhome/index.js',
    };

    it('single extension (short notation)', () => {
      const result = config.parseExtensions(
        { 'briskhome:extension': ['default'] },
        packageJson,
      );
      expect(result).toMatchSnapshot();
    });

    it('single extension (verbose notation)', () => {
      const result = config.parseExtensions(
        {
          'briskhome:extension': [
            {
              name: 'default',
              main: 'default.js',
              dependencies: ['dependency-name'],
            },
          ],
        },
        packageJson,
      );
      expect(result).toMatchSnapshot();
    });

    it('single extension (verbose notation / no overrides)', () => {
      const result = config.parseExtensions(
        {
          'briskhome:extension': [{}],
        },
        packageJson,
      );
      expect(result).toMatchSnapshot();
    });

    it('multiple extensions (same type)', () => {
      const result = config.parseExtensions(
        { 'briskhome:extension': ['one', 'two'] },
        packageJson,
      );
      expect(result).toMatchSnapshot();
    });

    it('multiple extensions (different types)', () => {
      const result = config.parseExtensions(
        { 'briskhome:extension-one': ['one'] },
        { 'briskhome:extension-two': ['two'] },
        packageJson,
      );
      expect(result).toMatchSnapshot();
    });

    it('invalid extension', () => {
      const result = config.parseExtensions(
        { 'briskhome:extension': [0] },
        packageJson,
      );
      expect(result).toMatchSnapshot();
    });
  });
});
