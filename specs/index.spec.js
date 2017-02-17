/**
 * @briskhome/core
 * └<specs/index.spec.js>
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

describe('BRISKHOME', function () {
  const components = [];
  const specs = [];

  it('should load a list of core components', function () {
    const directories = getDirectories('./lib');
    for (let i = 0; i < directories.length; i += 1) {
      if (directories[i].indexOf('core.') === 0) components.push(directories[i]);
    }

    assert.isNotNull(components);
  });

  it('should load specs from each core component', function () {
    for (let i = 0; i < components.length; i += 1) {
      const directories = getDirectories(path.resolve('./lib', components[i]));
      if (directories.indexOf('specs') > -1) specs.push(components[i]);
    }

    // FIXME: The next line should be uncommented after #29 is marked as resolved.
    // assert.equal(specs.length, components.length, 'not every core component has specs');
  });

  after(function () {
    for (let i = 0; i < specs.length; i += 1) {
      describe(specs[i], function () {
        require(path.resolve('./lib', specs[i], 'specs', 'index.spec.js'));
      });
    }
  });
});
