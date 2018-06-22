/* @flow */
import idx from 'idx';
import events from 'events';
import Config from './config';
import { flatten } from '../utils';
import ArchitectError from '../utils/ArchitectError';

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
    for (const extension of extensions) {
      await this.register(extension, options);
    }

    return this.extensions[type];
  }

  async resolve(type: string) {
    const extensions = [...(type in this.config ? this.config[type] : [])];
    if (!extensions.length) return [];

    const sortedExtensions = [];
    const resolvedExtensions = [];

    let shouldRetry = true;
    while (extensions.length && shouldRetry) {
      shouldRetry = false;

      for (const extension of extensions) {
        const dependencies = [...extension.dependencies];
        let didResolveDependencies = true;
        for (const item of dependencies) {
          if (!resolvedExtensions.includes(item)) {
            didResolveDependencies = false;
          } else {
            dependencies.splice(dependencies.indexOf(item), 1);
          }
        }

        if (!didResolveDependencies) continue;

        extensions.splice(extensions.indexOf(extension), 1);
        resolvedExtensions.push(extension.name);
        sortedExtensions.push(extension);
        shouldRetry = true;
      }
    }

    if (extensions.length) {
      const missingImports = flatten(
        extensions.map(({ dependencies }) => dependencies),
      );
      const missingExports = extensions.map(({ name }) => name);
      const unresolved = missingImports.filter(
        name => !missingExports.includes(name),
      );

      for (const name of unresolved) {
        const code = 'ERR_RESOLVE_FAILED';
        const msg = 'Could not resolve extension';
        this.emit('resolve', new ArchitectError(msg, code, { name, type }));
      }
    }

    return sortedExtensions;
  }

  async register(
    extension: any,
    { args = [], exec = true }: { args: Array<any>, exec: boolean } = {},
  ) {
    const config = this.get('com.briskhome.module', 'config');
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
          instance = await instance(options, imports);
        }
      }
      if (!this.extensions[extension.type]) {
        this.extensions[extension.type] = {};
      }

      this.extensions[extension.type][extension.name] = instance;
      this.emit(extension.type, instance);
    } catch (e) {
      const { name: id, type, metadata: { name: source } } = extension;
      const msg = 'Could not register extension';
      const code = 'ERR_REGISTER_FAILED';
      this.emit(
        'error',
        new ArchitectError(msg, code, { id, type, source, err: e }),
      );
    }
  }

  get(type, name) {
    return idx(this.extensions, x => x[type][name]) || null;
  }
}

export default Architect;
