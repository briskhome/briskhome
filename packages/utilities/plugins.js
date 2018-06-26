/** @flow
 * @briskhome
 * └core <utilities/plugins.js>
 */

import fs from 'fs';
import path from 'path';

import type { PackageJson } from '../utilities/coreTypes';

export const plugins = (
  directories?: Array<string> = ['./lib', './node_modules'],
): Array<string> =>
  [].concat(
    ...directories.map(directory =>
      fs
        .readdirSync(directory)
        .filter(
          subdirectory =>
            directory === './lib'
              ? fs
                  .statSync(path.resolve(directory, subdirectory))
                  .isDirectory() && subdirectory.indexOf('core.') === 0
              : fs
                  .statSync(path.resolve(directory, subdirectory))
                  .isDirectory() && subdirectory.indexOf('briskhome-') === 0,
        )
        .map(subdirectory => path.resolve(directory, subdirectory)),
    ),
  );

export const inspectPlugin = (directory: string): PackageJson =>
  JSON.parse(String(fs.readFileSync(path.resolve(directory, 'package.json'))));

export const enabledPlugins = (directories?: Array<string>): Array<string> =>
  plugins(directories).filter(
    directory =>
      inspectPlugin(directory).plugin &&
      !inspectPlugin(directory).plugin.disabled,
  );

export const disabledPlugins = (directories?: Array<string>): Array<string> =>
  plugins(directories).filter(
    directory =>
      inspectPlugin(directory).plugin &&
      inspectPlugin(directory).plugin.disabled,
  );

export const enablePlugin = (directory: string): boolean =>
  !!disabledPlugins().filter(plugin => {
    if (plugin.includes(directory)) {
      const payload = JSON.parse(
        String(fs.readFileSync(path.resolve(plugin, 'package.json'))),
      );
      payload.plugin.disabled = false;
      fs.writeFileSync(
        path.resolve(plugin, 'package.json'),
        JSON.stringify(payload, null, 2),
      );
      return true;
    }
    return false;
  }).length;

export const disablePlugin = (directory: string): boolean =>
  !!enabledPlugins().filter(plugin => {
    if (plugin.includes(directory)) {
      const payload = JSON.parse(
        String(fs.readFileSync(path.resolve(plugin, 'package.json'))),
      );
      payload.plugin.disabled = true;
      fs.writeFileSync(
        path.resolve(plugin, 'package.json'),
        JSON.stringify(payload, null, 2),
      );
      return true;
    }
    return false;
  }).length;
