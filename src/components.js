/** @flow
 * @briskhome
 * └core <lib/components.js>
 */

import fs from 'fs';
import path from 'path';

import type { PackageJson } from './utilities/coreTypes';

const components = (directories?: Array<string> = ['./lib', './node_modules']): Array<string> => {
  let modules = [];
  for (let i = 0; i < directories.length; i += 1) { // directories.map()?
    const directory = directories[i];
    modules = modules.concat(fs.readdirSync(directory)
      .filter(subdirectory => (directory === './lib'
        ? fs.statSync(path.resolve(directory, subdirectory)).isDirectory() && subdirectory.indexOf('core.') === 0
        : fs.statSync(path.resolve(directory, subdirectory)).isDirectory() && subdirectory.indexOf('briskhome-') === 0))
      .map(subdirectory => path.resolve(directory, subdirectory)));
  }

  return modules;
};

const inspectComponent = (directory: string): PackageJson =>
  JSON.parse(String(fs.readFileSync(path.resolve(directory, 'package.json'))),
);

const enabledComponents = (directories?: Array<string>): Array<string> => components(directories)
  .filter(directory =>
    inspectComponent(directory).plugin && !inspectComponent(directory).plugin.disabled,
);

const disabledComponents = (directories?: Array<string>): Array<string> => components(directories)
  .filter(directory =>
    inspectComponent(directory).plugin && !inspectComponent(directory).plugin.disabled,
);

const requireResources = (directory: string): Array<string> => (
  [].concat(...enabledComponents()
    .map(component => (fs.readdirSync(component).includes(directory)
      ? fs.readdirSync(path.resolve(component, directory))
        .map(resource => path.resolve(component, directory, resource))
      : []))
    .filter(resource => !!resource))
);

module.exports = {
  components,
  inspectComponent,
  enabledComponents,
  disabledComponents,
  requireResources,
};
