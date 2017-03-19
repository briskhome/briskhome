/**
 * @briskhome
 * └core.db <lib/core.db/specs/index.spec.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const ldap = require('ldapjs');

const bindStub = sinon.stub();
const unbindStub = sinon.stub();
const configStub = sinon.stub();

sinon.assert.expose(assert, { prefix: '' });

const logTraceStub = sinon.stub();
const logDebugStub = sinon.stub();
const logInfoStub = sinon.stub();
const logWarnStub = sinon.stub();
const logErrorStub = sinon.stub();
const logFatalStub = sinon.stub();

function Log() {
  this.trace = logTraceStub;
  this.debug = logDebugStub;
  this.info = logInfoStub;
  this.warn = logWarnStub;
  this.error = logErrorStub;
  this.fatal = logFatalStub;
}

const options = {};
const imports = {
  config: configStub,
  log: () => new Log(),
};

it('should bind', function () {
  sinon.stub(ldap, 'createClient').returns({
    bind: bindStub.yields(null),
    unbind: unbindStub,
  });

  require('../')(options, imports, (error) => {
    assert.isNull(error);
    assert.calledOnce(bindStub);
    assert.calledOnce(logDebugStub);
  });
});

it('should unbind when unable to bind', function () {
  sinon.stub(ldap, 'createClient').returns({
    bind: bindStub.yields(new Error('Foo')),
    unbind: unbindStub,
  });

  require('../')(options, imports, (error) => {
    assert.isNull(error);
    assert.calledOnce(bindStub);
    assert.calledOnce(unbindStub);
    assert.calledOnce(logErrorStub);
  });
});

describe.only('#find()', function () {
  beforeEach(function () {
    // sinon.stub(ldap, 'createClient').returns({
    //   bind: bindStub.yields(null),
    //   unbind: unbindStub,
    // });
  });

  it('should yield error when no query is provided', function (done) {
    require('../')(options, imports, (error, returns) => {
      assert.isNull(error);
      const component = returns.ldap;
      component.find(undefined, undefined, (findErr) => {
        assert.isNotNull(findErr);
        return done();
      });
    });
  });

  it('should ...', function (done) {
    require('../')(options, imports, (error, returns) => {
      assert.isNull(error);
      const component = returns.ldap;
      component.find('foo', {}, (findErr, findRes) => {
        assert.isNull(findErr);
        console.log(findRes);
        return done();
      });
    });
  });
});

describe('#findOne()', function () {
  it('should add sizeLimit option to existing options object');
});

describe('#findAndModify()', function () {
  it('...');
});

describe('#insert()', function () {
  it('...');
});

beforeEach(function () {
  configStub.returns({
    host: '192.168.88.247',
    identity: 'cn=admin,dc=briskhome,dc=com',
    password: 'admin',
  });
});

afterEach(function () {
  try {
    ldap.createClient.restore();
  } catch (e) {
    //
  }
  configStub.reset();
  bindStub.reset();
  unbindStub.reset();
});
