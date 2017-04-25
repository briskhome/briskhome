/**
 * @briskhome
 * └core <lib/components.js>
 */

const fs = require('fs');
const path = require('path');

const directories = ['./lib', './node_modules'];

function components() {
  let modules = [];
  for (let i = 0; i < directories.length; i += 1) {
    const directory = directories[i];
    modules = modules.concat(fs.readdirSync(directory)
      .filter(subdirectory => (directory === './lib'
        ? fs.statSync(path.resolve(directory, subdirectory)).isDirectory() && subdirectory.indexOf('core.') === 0
        : fs.statSync(path.resolve(directory, subdirectory)).isDirectory() && subdirectory.indexOf('briskhome-') === 0))
      .map(subdirectory => path.resolve(directory, subdirectory)));
  }

  return modules;
}

function enabledComponents() {
  return components().filter(subdirectory => !JSON.parse(path.resolve(subdirectory, 'package.json')).plugin.disabled);
}

function disabledComponents() {
  return components().filter(subdirectory => !!JSON.parse(path.resolve(subdirectory, 'package.json')).plugin.disabled);
}

module.exports = {
  components,
  enabledComponents,
  disabledComponents,
};
