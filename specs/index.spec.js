/* global after, afterEach, before, beforeEach, describe, it */
/* eslint import/no-dynamic-require: [0]                                                          */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint global-require: [0] */
/* eslint func-names: [0] */
/* eslint prefer-arrow-callback: [0] */

/**
 * @briskhome </specs/briskhome.spec.js>
 *
 * Test suites for BRISKHOME.
 *
 * @author  Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const fs = require('fs');
const path = require('path');

describe('BRISKHOME', function () {
  it('should prepare a list of installed components');

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
  }

  const components = getDirectories('../lib');
  for (let i = 0; i < components.length; i += 1) {
    if (components[i].indexOf('core.') === 0) {
      const subdirectories = getDirectories(path.join('../lib', components[i]));
      if (subdirectories.indexOf('specs') > -1) {
        describe(components[i], function () {
          require(path.join('../lib', components[i], 'specs', 'index.spec.js'));
        });
      }
    }
  }
});
