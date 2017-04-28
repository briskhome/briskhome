/**
 * @briskhome
 * └core.config <lib/core.config/specs/index.spec.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');

const logInfoStub = sinon.stub();
const loadStub = sinon.stub();
sinon.assert.expose(assert, { prefix: '' });

function Log() {
  this.info = logInfoStub;
}

const options = {};
const imports = {
  log: () => new Log(),
  loader: {
    load: loadStub,
  },
};

it('should throw when called without component name');

it('should load configuration', function (done) {
  loadStub.returns([]);
  require('../')(options, imports, (error, returns) => {
    const config = returns.config('foo');
    return done();
  });
});

it('should save configuration');
