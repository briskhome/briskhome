/**
 * @briskhome
 * └architect <utilities/specs/architect.spec.js>
 */

import path from 'path';
import Architect, {
  checkConfig,
  checkCycles,
  resolveConfig,
  resolveModule,
  resolvePackage,
} from '../architect';

jest.unmock('../architect');

let err;
let sut;
let base;
let main;

global.console = {
  error: () => null,
  log: () => null,
  warn: () => null,
};

describe('utilities/architect', () => {
  beforeEach(() => {
    err = undefined;
    base = path.resolve('.');
    main = './package.json';
  });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

  describe('resolvePackage()', () => {
    beforeEach(() => {
      sut = resolvePackage;
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

    it('should reject when package exists', async () => {
      base = __dirname;
      main = 'invalid';
      try { await sut(__dirname, main); } catch (e) { err = e; }
      expect(err.code).toEqual('ENOENT');
    });

    it('should resolve when package exists', async () => {
      base = __dirname;
      main = 'jest';
      const res = await sut(__dirname, main);
      expect(res).toEqual(path.resolve('node_modules', main));
    });
  });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

  describe('resolveModule()', () => {
    beforeEach(() => {
      sut = resolveModule;
      base = path.resolve(__dirname, '../..');
    });

    it('should resolve with metadata for an existing plugin', async () => {
      const res = await sut(base, './core.config');
      expect(Object.keys(res)).toEqual(
        ['name', 'version', 'main', 'author', 'private', 'plugin', 'dependencies', 'dirname', 'consumes', 'provides'],
      );
    });

    it('should resolve with error for a nonexisting plugin', async () => {
      const res = await sut(base, './core.invalid');
      expect(res).toBeInstanceOf(Error);
    });
  });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

  describe('resolveConfig()', () => {
    const keys = ['name', 'main', 'dirname', 'version', 'consumes', 'provides', 'exports'];

    beforeEach(() => {
      sut = resolveConfig;
      base = path.resolve(__dirname, '../../..');
    });

    it('should resolve a config w/o dependencies', async () => {
      const config = ['./src/core.log', './src/core.config'];
      const res = await sut(config, base);
      expect(res.length).toEqual(config.length);
      expect(Object.keys(res[0])).toEqual(keys);
      expect(Object.keys(res[1])).toEqual(keys);
    });

    it('should resolve a config with dependencies', async () => {
      const config = ['./src/core.log', './src/core.notifications'];
      const res = await sut(config, base);
      expect(res.length).toEqual(config.length);
      expect(Object.keys(res[0])).toEqual(keys);
      expect(Object.keys(res[1])).toEqual(keys);
    });

    it('should skip unresolved plugins when possible', async () => {
      const config = ['./src/core.invalid'];
      const res = await sut(config, base);
      expect(res.length).toBe(0);
    });
  });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

  describe('checkCycles()', () => {
    beforeEach(() => {
      sut = checkCycles;
      base = path.resolve(__dirname, '../..');
    });

    it('should return resolved dependencies', () => {
      const config = [{
        name: '@briskhome/core.config',
        main: '/opt/briskhome/src/core.config/index.js',
        dirname: './src/core.config',
        version: '0.3.0-alpha.1',
        consumes: [],
        provides: [],
        exports: { __esModule: true, default: [Object] },
      }, { name: '@briskhome/core.log',
        main: '/opt/briskhome/src/core.log/index.js',
        dirname: './src/core.log',
        version: '0.3.0-alpha.1',
        consumes: [],
        provides: [],
        exports: { __esModule: true, default: [Object] },
      }];
      const res = checkCycles(config, base);
      expect(res.length).toBe(2);
    });

    it('should throw when unable to resolve dependencies', () => {
      const config = [{
        name: '@briskhome/core.notifications',
        main: '/opt/briskhome/src/core.notifications/index.js',
        dirname: './core.notifications',
        version: '0.3.0-alpha.1',
        consumes: ['bus', 'db', 'log'],
        provides: [],
        exports: { __esModule: true, default: [Object] },
      }];
      try { checkCycles(config, base); } catch (e) { err = e; }
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Could not resolve dependencies');
    });
  });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

  describe('checkConfig()', () => {
    let config;

    beforeEach(() => {
      sut = checkConfig;
      config = [{
        name: '@briskhome/core.config',
        main: '/opt/briskhome/src/core.config/index.js',
        dirname: './src/core.config',
        version: '0.3.0-alpha.1',
        consumes: [],
        provides: [],
        exports: { __esModule: true, default: [Object] },
      }, { name: '@briskhome/core.log',
        main: '/opt/briskhome/src/core.log/index.js',
        dirname: './src/core.log',
        version: '0.3.0-alpha.1',
        consumes: [],
        provides: [],
        exports: { __esModule: true, default: [Object] },
      }];
    });

    it('should throw when consumes array is missing', () => {
      const plugin = config.slice(0, 1); delete plugin[0].consumes;
      try { sut(plugin); } catch (e) { err = e; }
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(`Plugin ${plugin[0].name} is missing the consumes array`);
    });

    it('should throw when provides array is missing', () => {
      const plugin = config.slice(0, 1); delete plugin[0].provides;
      try { sut(plugin); } catch (e) { err = e; }
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(`Plugin ${plugin[0].name} is missing the provides array`);
    });

    it('should return valid config', () => {
      const res = sut(config);
      expect(res.length).toBe(2);
    });
  });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

  describe('Architect', () => {
    let app;
    let config;

    beforeEach(() => {
      config = [{
        name: '@briskhome/core.config',
        main: '/opt/briskhome/src/core.config/index.js',
        dirname: './src/core.config',
        version: '0.3.0-alpha.1',
        consumes: [],
        provides: ['config'],
        exports: { __esModule: true, default: (a, b, c) => c(null, { config: () => {} }) },
      }, { name: '@briskhome/core.log',
        main: '/opt/briskhome/src/core.log/index.js',
        dirname: './src/core.log',
        version: '0.3.0-alpha.1',
        consumes: [],
        provides: ['log'],
        exports: { __esModule: true, default: (a, b, c) => c(null, { log: {} }) },
      }];
    });

    it('should return a new instance of Architect', () => {
      app = new Architect();
      expect(app).toBeInstanceOf(Architect);
    });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

    describe('loadPlugins()', () => {
      beforeEach(() => {
        app = new Architect();
      });

      it('should successfully load plugins', async () => {
        const res = await app.loadPlugins(config);
        expect(res).toBeTruthy();
        expect(res.config).toEqual(config);
        expect(Object.keys(res.services).length).toBe(2);
      });

      it('should collect provided destructors', async () => {
        config[1].exports = { __esModule: true, default: (a, b, c) => c(null, { log: {}, destroy: () => null }) };
        const res = await app.loadPlugins(config);
        expect(res).toBeTruthy();
        expect(res.config).toEqual(config);
        expect(Object.keys(res.services).length).toBe(2);
      });

      it('should emit error when plugin fails to initialize', async () => {
        err = new Error('Failed');
        config[1].exports = { __esModule: true, default: (a, b, c) => c(err) };
        app.on('error', (e) => {
          expect(e).toBeInstanceOf(Error);
          expect(e).toEqual(err);
        });
        process.nextTick(async () => app.loadPlugins(config));
      });

      it('should emit error when plugin fails to provide service', async () => {
        config[1].exports = { __esModule: true, default: (a, b, c) => c(null, {}) };
        app.on('error', (e) => {
          expect(e).toBeInstanceOf(Error);
          expect(e.message).toBe(
            `Plugin failed to provide ${config[1].provides[0]} service. ${JSON.stringify(config[1])}`,
          );
        });
        process.nextTick(async () => app.loadPlugins(config));
      });
    });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

    describe('getService()', () => {
      beforeEach(async () => {
        app = await new Architect().loadPlugins(config);
      });

      it('should return resolved service', () => {
        const res = app.getService(config[1].provides[0]);
        expect(res).toEqual({ name: config[1].provides[0] });
      });

      it('should throw when unable to resolve a service', () => {
        try { app.getService('invalid'); } catch (e) { err = e; }
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Service \'invalid\' not registered!');
      });
    });

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

    describe('destroy()', () => {
      beforeEach(async () => {
        app = await new Architect().loadPlugins(config);
      });

      it('should return false when asked to destroy invalid plugin', () => {
        const res = app.destroy('invalid');
        expect(res).toBe(false);
      });

      it('should throw when unable to destroy a plugin', () => {
        try { app.destroy(config[1].name); } catch (e) { err = e; }
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(`Plugins that provide services cannot be disabled. ${JSON.stringify(config[1])}`);
      });

      it('should destroy a single plugin using default destructor', async () => {
        config[1].provides = [];
        app.on('destroyed', (e) => {
          expect(e).toEqual(config[1]);
        });
        process.nextTick(() => app.destroy(config[1].name));
      });

      it('should destroy a single plugin using provided destructor', async () => {
        config[1].provides = [];
        config[1].exports = { __esModule: true, default: (a, b, c) => c(null, { destroy: () => null }) };
        app.on('destroyed', (e) => {
          expect(e).toEqual(config[1]);
        });
        process.nextTick(() => app.destroy(config[1].name));
      });

      it('should destroy the app', () => {
        config[0].provides = [];
        config[1].provides = [];
        const res = app.destroy();
        expect(res).toBe(true);
        expect(app.destructors.size).toBe(0);
      });
    });
  });
});
