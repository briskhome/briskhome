/**
 * @briskhome
 * └core.db <lib/core.db/specs/index.spec.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const mongoose = require('mongoose');
const Emitter = require('events').EventEmitter;

const connection = new Emitter();
const configStub = sinon.stub();
// const mongoStub =
const loadStub = sinon.stub();

sinon.assert.expose(assert, { prefix: '' });

const options = {};
const imports = {
  config: configStub,
  loader: {
    load: loadStub,
  },
};

beforeEach(function () {
  sinon.stub(mongoose, 'connect').returns({ connection });
});

afterEach(function () {
  mongoose.connect.reset();
  mongoose.connect.restore();
});

it.skip('should attempt connecting to database', function (done) {
  loadStub.returns([]);
  configStub.returns({});
  require('../')(options, imports, (error, returns) => {
    const db = returns.db;
    connection.emit('open');
    assert.isDefined(db);
    assert.calledOnce(mongoose.connect);
    configStub.reset();
    return done();
  });
});

it.skip('should compile a connection string', function (done) {
  loadStub.returns([]);
  configStub.returns({ user: 'foo', pass: 'bar', host: 'foobar', name: 'baz' });
  require('../')(options, imports, (error, returns) => {
    const db = returns.db;
    connection.emit('open');
    assert.isDefined(db);
    assert.calledOnce(configStub);
    assert.calledWith(mongoStub, '`mongodb://foo:bar@foobar/baz');
    configStub.reset();
    mongoStub.reset();
    return done();
  });
});

it.skip('should yield error when unable to connect to database', function (done) {
  loadStub.returns([]);
  configStub.returns({});
  require('../')(options, imports, (error) => {
    assert.instanceOf(error, Error);
    configStub.reset();
    mongoStub.reset();
    return done();
  });
});
