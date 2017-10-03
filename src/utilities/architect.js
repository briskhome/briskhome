/** @flow
 * @briskhome
 * └architect <utilities/architect.js>
 */

import fs from 'fs';
import path from 'path';
import events from 'events';
import { normalizeName } from './helpers';


// XXX: Consider replacing the following statement with `packagePathCache = new WeakMap();`
const packagePathCache: Object = {};

/**
* Checks whether the file at provided path exists and returns real path.
* @param  {String} base      Directory to be used as a base for searching.
* @param  {String} plugin    Either a path (absolute or relative) or module name.
* @return {Promise<string>}  Real path to package.json file.
*/
export const resolvePackage = (base: string, plugin: string):Promise<string> => {
  if (!(base in packagePathCache)) {
    packagePathCache[base] = {};
  }

  const cache = packagePathCache[base];
  if (plugin in cache) {
    return cache[plugin];
  }

  const rejectErr: Object = new Error(`Can't find ${plugin} relative to ${base}`);
  rejectErr.code = 'ENOENT';
  if (plugin[0] === '.' || plugin[0] === '/') {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(base, plugin);
      return fs.access(fullPath, fs.constants.R_OK, (accessErr) => {
        if (accessErr) reject(rejectErr);
        return fs.realpath(fullPath, (realpathErr, realpathValue) => {
          if (realpathErr) reject(rejectErr);
          cache[plugin] = realpathValue;
          return resolve(realpathValue);
        });
      });
    });
  }

  const tryNext = (tryBase: string):Promise<string> => new Promise((resolve, reject) => {
    if (tryBase === '/') {
      return reject(rejectErr);
    }

    const tryPath = path.resolve(tryBase, 'node_modules', plugin);
    return fs.access(tryPath, fs.constants.R_OK, (accessErr) => {
      if (!accessErr) {
        return fs.realpath(tryPath, (realpathErr, realpathValue) => {
          if (realpathErr) reject(rejectErr);
          cache[plugin] = realpathValue;
          return resolve(realpathValue);
        });
      }

      const nextBase = path.resolve(tryBase, '..');
      return resolve(tryNext(nextBase === tryBase ? '/' : nextBase));
    });
  });

  return tryNext(base);
};

/**
* Collects plugin metadata and wraps it in the Architect-friendly way.
* @param  {[type]} base    [description]
* @param  {[type]} plugin  [description]
* @param  {[type]} key     [description]
* @return {[type]}         [description]
*/
export const resolveModule = async (base: string, plugin: string, key: string = 'plugin')
  : Promise<Object|Error> => {
  let metadata = {};
  let pluginPackage;
  try {
    pluginPackage = await resolvePackage(base, `${plugin}/package.json`);
    metadata = (pluginPackage && require(pluginPackage)) || {};
  } catch (e) { if (e.code !== 'ENOENT') return e; }

  const resolvedBase = path.resolve(base, plugin);
  let resolvedPlugin;
  if (!pluginPackage) {
    try {
      resolvedPlugin = await resolvePackage(base, `${plugin}.js`);
    } catch (e) { return e; }
  } else if (metadata && metadata.main) {
    try {
      resolvedPlugin = await resolvePackage(resolvedBase,
        (metadata.main[0] === '.' || metadata.main[0] === '/')
          ? metadata.main
          : `./${metadata.main}`,
      );
    } catch (e) { return e; }
  } else if (!metadata) {
    try {
      resolvedPlugin = await resolvePackage(base, path.dirname(pluginPackage));
    } catch (e) { return e; }
  }

  let consumes;
  let provides;
  try {
    [consumes, provides] = (metadata && metadata[key] && metadata[key].consumes && metadata[key].provides)
      ? [metadata.plugin.consumes, metadata.plugin.provides]
      : require(resolvedPlugin);
  } catch (e) { [consumes, provides] = [[], []]; }

  metadata.main = resolvedPlugin;
  metadata.dirname = plugin;
  metadata.consumes = consumes;
  metadata.provides = provides;

  return metadata;
};

/**
 * Resoves a list of plugins to an architect-consumableconfiguration object.
 * @param config
 * @param base
 * @param key
 * @returns {Promise.Object}
 */
export const resolveConfig = async (config: Array<*>, base: string, key?: string): Promise<*> => {
  const timeout = new Promise((resolve, reject) => setTimeout(() => reject(new Error('Plugin load timeout')), 1000));
  const plugins: Array<Object> = await Promise.all(config.map(plugin =>
    Promise.race([resolveModule(base, plugin.main || plugin, key), timeout]),
  ));

  return plugins
    .filter(plugin => plugin.constructor !== Error)
    .map((plugin, index) => ({
      name: plugin.name,
      main: plugin.main,
      dirname: plugin.dirname,
      version: plugin.version,
      consumes: plugin.consumes,
      provides: plugin.provides,
      exports: require(plugin.main),
      ...(config[index].main ? config[index] : {}),
    }));
};

/**
 * Resolves and builds the plugin dependency tree.
 * @param config
 */
export const checkCycles = (config: Array<Object>): Array<Object> => {
  const plugins = [];
  for (let i = 0; i < config.length; i += 1) {
    plugins.push({
      i,
      main: config[i].main,
      provides: config[i].provides.concat(),
      consumes: config[i].consumes.concat(),
    });
  }

  const sorted = [];
  const resolved = [];

  let retry = true;
  while (plugins.length && retry) {
    retry = false;
    plugins.forEach((plugin) => {                                                                 // eslint-disable-line
      const consumes = plugin.consumes.concat();

      let resolvedAll = true;
      for (let i = 0; i < consumes.length; i += 1) {
        const service = consumes[i];
        if (!resolved.includes(service)) {
          resolvedAll = false;
        } else {
          plugin.consumes.splice(plugin.consumes.indexOf(service), 1);
        }
      }

      if (!resolvedAll) {
        return;
      }

      plugins.splice(plugins.indexOf(plugin), 1);
      plugin.provides.forEach(service => resolved.push(service));
      sorted.push(config[plugin.i]);
      retry = true;
    });
  }

  if (plugins.length) {
    const unresolved = {};
    plugins.forEach((plugin) => {
      plugin.consumes.forEach((name) => {
        if (unresolved[name] === false) {
          return;
        }

        if (!unresolved[name]) {
          unresolved[name] = [];
        }

        unresolved[name].push(plugin.main);
      });

      plugin.provides.forEach((name) => {
        unresolved[name] = false;
      });
    });

    Object.keys(unresolved).forEach((name) => {
      if (unresolved[name] === false) {
        delete unresolved[name];
      }
    });

    console.error('Could not resolve dependencies of these plugins:', plugins);
    console.error('Resolved services:', resolved);
    console.error('Missing services:', unresolved);
    throw new Error('Could not resolve dependencies');
  }

  return sorted;
};

/**
 * Checks whether the progin complies with the architect plugin format.
 * @param config
 */
export const checkConfig = (config: Array<Object>): Array<Object> =>
  checkCycles(config.map((plugin) => {
    if (!Object.prototype.hasOwnProperty.call(plugin, 'checked')) {
      if (!Object.prototype.hasOwnProperty.call(plugin, 'consumes')) {
        throw new Error(`Plugin ${plugin.name} is missing the consumes array`, JSON.stringify(plugin));
      } else if (!Object.prototype.hasOwnProperty.call(plugin, 'provides')) {
        throw new Error(`Plugin ${plugin.name} is missing the provides array`, JSON.stringify(plugin));
      }
    }
    return plugin;
  }));

/**
 * The Architect.
 * Loads plugins from the provided config object.
 */
export default class Architect extends events.EventEmitter {
  config: Array<Object>;
  destructors: Map<string, Function>;
  services: Object;

  constructor() {
    super();
    const app = this;
    app.config = [];
    app.destructors = new Map();
    app.services = {};
  }

  loadPlugins(promisedConfig: Array<*>|Promise<Array<*>>) {
    return new Promise(async (resolve, reject) => {
      const app = this;
      const config = await promisedConfig;
      let sortedConfig;
      try {
        sortedConfig = checkConfig(config).filter(c => config.indexOf(c) > -1);
      } catch (e) {
        return reject(e);
      }

      sortedConfig = sortedConfig.filter(c => config.indexOf(c) > -1);

      let p;
      function next(err) {
        if (err) {
          return reject(err);
        }
        if (p && app.config.indexOf(p) === -1) {
          app.config.push(p);
        }

        p = sortedConfig.shift();
        if (!p) {
          return resolve(app);
        }
        try {
          return app.registerPlugin(p, next);
        } catch (e) {
          return reject(e);
        }
      }

      return next();
    });
  }

  registerPlugin(plugin: Object, next: Function) {
    const app = this;
    const services = app.services;
    const imports = {};
    const { consumes, provides, exports, ...options } = plugin;

    if (plugin.consumes) {
      plugin.consumes.forEach((name) => {
        imports[name] = services[name];
      });
    }

    try {
      (async () => plugin.exports.default({
        ...options, ...(services.config ? services.config(normalizeName(plugin.name)) : {}),
      }, imports, register))();                                                                   // eslint-disable-line
    } catch (e) {
      throw e;
    }

    function register(err, provided) {
      if (err) {
        if (!services.bus) throw err;
        return services.bus.emit('core:error', err);
      }

      plugin.provides.forEach((name) => {
        if (!Object.keys(provided).includes(name)) {
          const error = new Error(`Plugin failed to provide ${name} service. ${JSON.stringify(plugin)}`);
          if (!services.bus) throw error;
          return services.bus.emit('core:error', error);
        }

        services[name] = provided[name];
        if (typeof provided[name] !== 'function') {
          provided[name].name = name;                                                             // eslint-disable-line
        }

        if (services.bus) services.bus.emit('core:service', name, services[name]);
        return null;
      });

      if (provided && provided.destroy) {
        app.destructors.set(plugin.name, provided.destroy);
      } else {
        plugin.destroy = () => {                                                                  // eslint-disable-line
          if (plugin.provides.length) {
            let canDestroy = true;                                                           // eslint-disable-next-line
            const consumes = Object.keys(app.services).reduce((acc, item) => acc.concat(acc, item));
            plugin.provides.forEach((item) => {
              if (consumes.includes(item)) canDestroy = false;
            });
            if (!canDestroy) {
              throw new Error(`Plugins that provide services cannot be disabled. ${JSON.stringify(plugin)}`);
            }
          }

          if (provided && provided.destroy) {
            app.destructors.delete(plugin.name);
            provided.destroy();
          }

          app.config.splice(app.config.indexOf(plugin), 1);
          if (services.bus) services.bus.emit('core:destroyed', plugin);
        };
        app.destructors.set(plugin.name, plugin.destroy);
      }

      if (services.bus) services.bus.emit('core:plugin', plugin);
      return next();
    }
  }

  getService(name: string) {
    if (!this.services[name]) {
      throw new Error(`Service '${name}' not registered!`);
    }
    return this.services[name];
  }

  /**
   * Destroys either a specific service or, if no argument was passed, all services.
   * @param plugin
   * @returns {boolean}
   */
  destroy(plugin: string) {
    const app = this;
    if (plugin) {
      const destroy = app.destructors.get(plugin);
      return destroy ? destroy() : false;
    }

    app.destructors.forEach(destroy => destroy());
    app.destructors.clear();
    return true;
  }
}
