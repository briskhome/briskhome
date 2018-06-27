/* @flow */
import idx from 'idx';
import events from 'events';
import logger from './logger';
import Config from './config';
import ArchitectError from '../utils/ArchitectError';

const log = logger('core');

class Architect extends events.EventEmitter {
  config: { [string]: any } = {};
  extensions: { [string]: any } = {};

  static async create() {
    const app = new Architect();
    app.config = await Config.init();
    return app;
  }

  async load(type: string, options: { args: Array<any>, exec: boolean }) {
    const extensions = await this.resolve(type);
    log.debug(`Resolved ${extensions.length} extensions of type '${type}'`);

    const failed = [];
    for (const extension of extensions) {
      try {
        if (extension.dependencies.every(d => !failed.includes(d))) {
          log.trace(
            { extension: extension.name, type: extension.type },
            `Trying to register an extension`,
          );
          await this.register(extension, options);
        } else {
          log.info(
            { extension: extension.name, type: extension.type },
            'Skipping the extension because a dependecy has failed',
          );
        }
      } catch (err) {
        failed.push(extension.name);
      }
    }

    return this.extensions[type];
  }

  async resolve(type: string) {
    const extensions = [...(type in this.config ? this.config[type] : [])];
    if (!extensions.length) return [];

    const sorted = [];
    const resolved = [];

    let shouldRetry = true;
    while (extensions.length && shouldRetry) {
      shouldRetry = false;
      extensions.forEach(extension => {
        log.trace(
          { extension: extension.name, type },
          `Will resolve extension`,
        );
        const consumes = [...extension.dependencies];

        let didResolve = true;
        for (let i = 0; i < consumes.length; i += 1) {
          const service = consumes[i];
          if (!resolved.includes(service)) {
            didResolve = false;
          } else {
            consumes.splice(consumes.indexOf(service));
          }
        }

        if (!didResolve) {
          log.trace(
            { extension: extension.name, type },
            `Skipping because of unmet dependencies '${consumes.join("', '")}'`,
          );
          return;
        }

        log.trace({ extension: extension.name, type }, `Dependencies are met`);

        extensions.splice(extensions.indexOf(extension), 1);
        resolved.push(extension.name);
        sorted.push(extension);
        shouldRetry = true;
      });
    }

    if (extensions.length) {
      const unresolved = {};
      extensions.forEach(extension => {
        extension.dependencies.forEach(name => {
          if (unresolved[name] === false) return;
          if (!unresolved[name]) unresolved[name] = [];
          unresolved[name].push(extension.main);
        });

        unresolved[extension.name] = false;
      });

      Object.keys(unresolved).forEach(name => {
        if (unresolved[name] === false) {
          delete unresolved[name];
        }
      });

      log.error(`${extensions.length} extensions have unmet dependencies:`);
      log.error(`${extensions.map(e => e.name).join(', ')}`);
      log.debug(`Resolved: ${resolved.map(e => e.name).join(', ')}`);
      log.debug(`Missing: ${unresolved.map(e => e.name).join(', ')}`);

      throw new Error('Could not resolve dependencies');
    }

    return sorted;
  }

  async register(
    extension: any,
    { args = [], exec = true }: { args: Array<any>, exec: boolean } = {},
  ) {
    const config = this.get('com.briskhome.module', 'core.config');
    const options = config ? config(extension.name) : {};
    const imports = { app: this };
    if (extension.dependencies.length) {
      for (const name of extension.dependencies) {
        imports[name] = this.extensions[extension.type][name];
      }
    }

    try {
      let instance = require(extension.main);
      if (extension.name in instance) instance = instance[extension.name];
      else instance = instance['default'];

      if (exec) {
        if (args.length) {
          instance = await instance(...args);
        } else {
          instance = await instance(imports, options);
        }
      }
      if (!this.extensions[extension.type]) {
        this.extensions[extension.type] = {};
      }

      this.extensions[extension.type][extension.name] = instance;
      this.emit(extension.type, instance);

      log.info(
        { extension: extension.name, type: extension.type },
        'Registered a new extension',
      );
    } catch (err) {
      log.warn(
        { extension: extension.name, type: extension.type },
        `Could not load extension, skipping dependents`,
      );
      log.debug(
        { extension: extension.name, type: extension.type, err },
        'An unhandled exception prevented extension from loading',
      );

      this.ex;

      const { name: id, type, metadata: { name: source } } = extension;
      const msg = `Failed to load extension '${id}'. All dependencies will be skipped as well.`;
      const code = 'ERR_REGISTER_FAILED';
      throw new ArchitectError(msg, code, { id, type, source, err: err });
    }
  }

  get(type, name) {
    return idx(this.extensions, x => x[type][name]) || null;
  }
}

export default Architect;
