/** @flow
 * @briskhome
 * â””core.architect <index.js>
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import ArchitectError from '../utils/ArchitectError';
import {
  flatten,
  isExtension,
  isPathname,
  normalize,
  timeout,
  toPathname,
} from '../utils';
import type { Extensions, PackageJson } from '../types';

const readdirAsync = promisify(fs.readdir);
const realpathAsync = promisify(fs.realpath.native);

class Config {
  directories: string[];
  extensions: Extensions = {};

  static async init(directories: string[]) {
    const config = new Config(directories);
    const modules = await config.discover();
    return config.prepareExtensions(modules);
  }

  constructor(directories = ['./lib', './node_modules']) {
    this.directories = directories;
  }

  async discover() {
    const buckets = await Promise.all(
      this.directories.map(directory => readdirAsync(directory)),
    );

    return flatten(
      buckets.map((directories, index) =>
        directories.map(dir => path.resolve(this.directories[index], dir)),
      ),
    );
  }

  async prepareExtensions(directories: Array<string>, base: string) {
    const modules: Array<Object> = await Promise.all(
      directories.map(directory =>
        Promise.race([this.getMetadata(base, directory), timeout()]),
      ),
    );
    const extensions = flatten(
      modules.filter(extension => !(extension instanceof ArchitectError)),
    );
    return extensions.reduce((extensions, extension) => {
      if (!extensions[extension.type]) extensions[extension.type] = [];
      extensions[extension.type].push(extension);
      return extensions;
    }, {});
  }

  async getMetadata(base: string, name: string): Promise<any> {
    let metadata: ?PackageJson = null;
    let extensionMain: ?string = null;

    try {
      const packageJson = await this.getRealpath(base, `${name}/package.json`);
      metadata = require(packageJson);
    } catch (e) {
      if (e instanceof ArchitectError) return e;
    }

    try {
      if (!metadata) {
        extensionMain = await this.getRealpath(base, `${name}.js`);
        metadata = require(extensionMain);
      } else {
        const dir: ?string = path.resolve(base, name);
        const main = metadata.main || 'index.js';
        extensionMain = await this.getRealpath(dir, toPathname(main));
      }
    } catch (e) {
      if (e instanceof ArchitectError) return e;
    }

    if (!isExtension(metadata)) {
      return new ArchitectError(
        'Resolved package is not a valid extension',
        'ERR_INVALID_EXTENSION',
      );
    }

    return this.parseExtensions(metadata.extensions, {
      name: metadata.name,
      dir: path.resolve(base, name),
      main: extensionMain,
      author: metadata.author,
      version: metadata.version,
      description: metadata.description,
      coreVersion: metadata.peerDependencies['@briskhome/core'],
    });
  }

  async getRealpath(base: string, name: string): Promise<string> {
    if (isPathname(name)) {
      const fullPath = path.resolve(base, name);
      try {
        const realPath = await realpathAsync(fullPath);
        return realPath;
      } catch (e) {
        throw new ArchitectError(
          `Can't resolve extension '${name}' relative to '${base}'`,
          'ERR_NO_EXTENSION',
        );
      }
    }

    const next = async (maybeBase: string): Promise<string> => {
      const nextPath = path.resolve(maybeBase, 'node_modules', name);
      try {
        const realPath = await realpathAsync(nextPath);
        return realPath;
      } catch (e) {
        const nextBase = path.resolve(maybeBase, '..');
        if (nextBase === maybeBase) {
          throw new ArchitectError(
            `Can't resolve package '${name}' relative to '${base}'`,
            'ERR_NO_PACKAGE',
          );
        }
        return next(nextBase);
      }
    };

    return next(base);
  }

  parseExtensions(extensions: Extensions, metadata: PackageJson) {
    const parsed = [];
    function parse(extension, type) {
      const isDefault = extensions[type].length === 1;
      if (typeof extension === 'string') {
        parsed.push({
          name: extension,
          type,
          main: metadata.main,
          dependencies: [],
          metadata,
          isDefault,
        });
      } else if (typeof extension === 'object') {
        parsed.push({
          name: extension.name || normalize(metadata.name),
          type,
          main: extension.main
            ? path.resolve(metadata.dir, extension.main)
            : metadata.main,
          dependencies: extension.dependencies || [],
          metadata,
          isDefault,
        });
      }
    }

    for (const type of Object.keys(extensions)) {
      for (const extension of extensions[type]) {
        parse(extension, type);
      }
    }

    return parsed;
  }
}

export default Config;
