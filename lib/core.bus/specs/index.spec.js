/**
 * @briskhome
 * └core.bus <lib/core.bus/specs/index.spec.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');

const logInfoStub = sinon.stub();

function Log() {
  this.info = logInfoStub;
}

const options = {};
const imports = {
  log: () => new Log(),
};

require('../')(options, imports, (error, returns) => {
  const bus = returns.bus;

  it('should transmit events', function (done) {
    const foo = { foo: 'bar' };
    bus.once('foo', (data) => {
      assert.equal(data, foo);
      assert.calledOnce(logInfoStub);
      logInfoStub.reset();
      return done();
    });

    bus.emit('foo', foo);
  });
});
