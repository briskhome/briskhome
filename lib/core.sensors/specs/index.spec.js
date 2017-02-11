/**
 * @briskhome
 * └core.sensors </lib/core.sensors/specs/index.spec.js>
 *
 * @author  Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const fs = require('fs');
const async = require('async');
const sinon = require('sinon');
const assert = require('chai').assert;

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
  log: () => new Log(),
};

describe('#findSensor()', function () {
  // require('../')(options, imports, (error, returns) => {
  //   const sensors = returns.sensors;
  //   it('should yield error when unable to connect to database');
  // });
});

describe('#findReading()', function () {

});

describe('#addReading()', function () {

});
