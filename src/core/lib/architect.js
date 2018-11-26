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
    log.debug({ type }, `Resolving extensions from config`);
    const extensions = await this.resolve(type);
    log.debug({ type }, `Resolved ${extensions.length} extensions`);

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
            'Skipping the extension because a dependency has failed',
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
    if (!extensions.length) return extensions;

    const sorted = [];
    const resolved = [];

    let shouldRetry = true;
    while (extensions.length && shouldRetry) {
      shouldRetry = false;
      for (const extension of extensions) {
        log.trace({ extension: extension.name, type }, `Resolving extension`);
        const dependencies = [...extension.dependencies];

        let didResolve = true;
        for (let i = 0; i < dependencies.length; i += 1) {
          const service = dependencies[i];
          if (!resolved.includes(service)) {
            didResolve = false;
          } else {
            dependencies.splice(dependencies.indexOf(service));
          }
        }

        if (!didResolve) {
          log.trace(
            { extension: extension.name, type },
            `Unmet dependencies: ['${dependencies.join("', '")}']`,
          );
          continue;
        }

        log.trace({ extension: extension.name, type }, `Dependencies OK`);

        extensions.splice(extensions.indexOf(extension), 1);
        resolved.push(extension.name);
        sorted.push(extension);
        shouldRetry = true;
      }
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
        { extension: extension.name, type: extension.type, err },
        `Failed to load extension`,
      );

      const {
        name: id,
        type,
        metadata: { name: source },
      } = extension;
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
