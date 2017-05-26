/* global jest beforeEach describe it expect */

import path from 'path';
import Architect, {
  checkCycles,
  resolveConfig,
  resolveModule,
  resolvePackage,
} from '../utilities/architect';

jest.unmock('../utilities/architect');

let err;
let sut;
let base;
let modulePath;
let main;

beforeEach(() => {
  // global.console = {
  //   log: jest.fn(),
  //   warn: jest.fn(),
  //   error: jest.fn(),
  // };
});

describe('briskhome-architect', () => {
  describe('resolvePackage', () => {
    beforeEach(() => {
      err = undefined;
      sut = resolvePackage;
      base = path.resolve(__dirname, '../..');
      modulePath = '.';
      main = './package.json';
    });

    it('should resolve when relative path is correct', async () => {
      main = './package.json';
      const res = await sut(base, main);
      expect(res).toEqual(path.resolve(base, main));
    });

    it('should resolve with cached value on subsequent calls', async () => {
      main = './package.json';
      expect(await sut(base, main)).toEqual(await sut(base, main));
    });

    it('should reject when relative path does not exist', async () => {
      base = path.resolve(__dirname);
      main = './package.json';
      try { await sut(base, main); } catch (e) { err = e; }
      expect(err.code).toEqual('ENOENT');
    });

    it('should resolve when absolute path is correct', async () => {
      main = path.resolve(__dirname, base, './package.json');
      const res = await sut(base, main);
      expect(res).toEqual(path.resolve(main));
    });

    it('should reject when absolute path does not exist', async () => {
      base = path.resolve(__dirname);
      main = path.resolve(__dirname, './package.json');
      try { await sut(base, main); } catch (e) { err = e; }
      expect(err.code).toEqual('ENOENT');
    });

    it('should resolve when absolute path is correct', async () => {
      main = 'jest';
      const res = await sut(base, main);
      expect(res).toEqual(path.resolve(base, 'node_modules', main));
    });
  });

  describe('resolveModule', () => {
    beforeEach(() => {
      err = undefined;
      base = path.resolve(__dirname, './core.bus');
      main = './package.json';
    });

    it('should resolve an existing plugin (i.e. core.bus)', async () => {
      let res;
      try {
        res = await resolveModule(base, '.');
      } catch (e) {
        // console.log('e', e);
      }
      // console.log('res', res);
    });
  });

  describe('resolveConfig', () => {
    beforeEach(() => {
      err = undefined;
      base = path.resolve(__dirname, '../..');
      // config = [{ main: './src/core.bus' }, './src/core.loader'];
    });

    it('should resolve a simple config', async () => {
      const config = [{ main: './src/core.bus' }, './src/core.loader'];
      const keys = ['main', 'name', 'version', 'consumes', 'provides', 'exports'];
      const res = await resolveConfig(config, base);
      expect(res.length).toEqual(config.length);
      expect(Object.keys(res[0])).toEqual(keys);
      expect(Object.keys(res[1])).toEqual(keys);
    });

    it('should resolve a complex config', async () => {
      const config = [{ main: './src/core.bus' }, './src/core.loader', './src/core.config'];
      const keys = ['main', 'name', 'version', 'consumes', 'provides', 'exports'];
      const res = await resolveConfig(config, base);
      expect(res.length).toEqual(config.length);
      expect(Object.keys(res[0])).toEqual(keys);
      expect(Object.keys(res[1])).toEqual(keys);
      expect(Object.keys(res[2])).toEqual(keys);
    });

    it('should throw ehwn unable to resolve a plugin', async () => {
      const config = ['./src/core.invalid'];
      try { await resolveConfig(config, base); } catch (e) { err = e; }
      expect(err).toBeInstanceOf(Error);
    });
  });

  describe('checkCycles', () => {
    let validConfig;
    let invalidConfig;

    beforeEach(async () => {
      validConfig = await resolveConfig(['./src/core.config', './src/core.loader'], base);
      invalidConfig = await resolveConfig(['./src/core.bus'], base);
    });

    it('should return resolved dependencies', async () => {
      const res = await checkCycles(validConfig, base);
      expect(res.length).toBe(2);
    });

    it('should rethrow when resolveConfig throws', async () => {
      try { await checkCycles(invalidConfig, base); } catch (e) { err = e; }
      expect(err).toBeInstanceOf(Error);
    });
  });

  describe('checkConfig', () => {
    it('works?');
  });

  describe('Architect', () => {

    it('should return an instance of Architect', () => {
      const app = new Architect();
      expect(app).toBeInstanceOf(Architect);
    });

    describe('loadPlugins', () => {
      let app;

      beforeEach(() => {
        app = new Architect();
      });

      it('should load plugins', async () => {
        const res = await app.loadPlugins();
        expect(res).tobeTruthy();
      });
    });

    describe('registerPlugin', () => {
      it('works?');
    });

    describe('getService', () => {
      it('works?');
    });
  });
});
