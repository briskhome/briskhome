/**
 * @briskhome
 * └core.db <lib/core.db/specs/index.spec.js>
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');

const discriminatorStub = sinon.spy();
const configStub = sinon.stub();
const databaseMock = {
  model: sinon.stub(),
  Schema: sinon.stub(),
};

const options = {};
const imports = {
  config: configStub,
  db: databaseMock,
};

beforeEach(function () {
  configStub.returns({});
  databaseMock.model.returns({ discriminator: discriminatorStub });
});

afterEach(function () {
  configStub.reset();
  databaseMock.model.reset();
  databaseMock.Schema.reset();
});

it('should register component', function (done) {
  require('../')(options, imports, (error, returns) => {
    const log = returns.log;
    assert.isDefined(log);
    return done();
  });
});

it('should register additional log schema when provided');
