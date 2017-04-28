/**
 * @briskhome
 * └core <lib/components.js>
 */

const fs = require('fs');
const path = require('path');

const components = (directories = ['./lib', './node_modules']) => {
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

const parseComponent = directory => (
  JSON.parse(fs.readFileSync(path.resolve(directory, 'package.json'))) || {}
);

const enabledComponents = directories => components(directories).filter(directory => (
  parseComponent(directory).plugin && !parseComponent(directory).plugin.disabled
));

const disabledComponents = directories => components(directories).filter(directory => (
  parseComponent(directory).plugin && !parseComponent(directory).plugin.disabled
));


module.exports = {
  components,
  enabledComponents,
  disabledComponents,
  parseComponent,
};
