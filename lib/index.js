/**
 * @briskhome
 * └core <lib/index.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const fs = require('fs');
const path = require('path');

const directories = ['./lib', './node_modules'];

module.exports = {
  components,
  enabledComponents,
  disabledComponents,
};

function components() {
  let modules = [];

  for (let i = 0; i < directories.length; i += 1) {
    const directory = directories[i];
    modules = modules.concat(fs.readdirSync(directory)
      .filter(subdirectory => directory === './lib'                           // eslint-disable-line
        ? fs.statSync(path.resolve(directory, subdirectory)).isDirectory()
          && subdirectory.indexOf('core.') === 0
        : fs.statSync(path.resolve(directory, subdirectory)).isDirectory()
          && subdirectory.indexOf('briskhome-') === 0)
      .map(subdirectory => path.resolve(directory, subdirectory))             // eslint-disable-line
    );
  }

  return modules;
}

function enabledComponents() {
  return components()
    .filter(subdirectory => !(
      require(path.resolve(subdirectory, 'package.json')).plugin.disabled     // eslint-disable-line
    ));
}

function disabledComponents() {
  return components()
    .filter(subdirectory => !!(
      require(path.resolve(subdirectory, 'package.json')).plugin.disabled     // eslint-disable-line
    ));
}
