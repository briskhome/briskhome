/** @flow
 * @briskhome
 * └core <./resources.js>
 */

import * as fs from 'fs';
import * as path from 'path';
import { enabledPlugins } from './plugins';

/**
 * resources()
 * Returns an array of initialized resources.
 * If array of arguments is present it is passed to every resource.
 */
export const resources = (type: string, args?: ?Array<*>): Array<*> =>
  enabledPlugins().reduce((acc, plugin) => {
    if (!fs.readdirSync(plugin).includes(type)) return acc;
    return acc.concat(fs.readdirSync(path.resolve(plugin, type))
      .map((resource) => {
        switch (args) {
          case undefined:
            return path.resolve(plugin, type, resource);
          case null:
            return require(path.resolve(plugin, type, resource)).default                          // eslint-disable-line
          default:
            return require(path.resolve(plugin, type, resource)).default(...args);                // eslint-disable-line
        }
      }),
    );
  }, []);

export const whatprovides = () => {
  throw new Error('Not Implemented!');
};
