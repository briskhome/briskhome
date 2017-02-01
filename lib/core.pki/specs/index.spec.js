/* global after, afterEach, before, beforeEach, describe, it */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint global-require: [0] */
/* eslint func-names: [0] */
/* eslint prefer-arrow-callback: [0] */

/**
 * @briskhome
 * └core.pki </lib/core.pki/specs/index.spec.js>
 *
 * Юнит-тесты для компонента инфраструктуры приватных ключей.
 *
 * @author  Егор Зайцев <ezaitsev@briskhome.com>
 * @version 0.3.0-rc.2
 */

'use strict';

const fs = require('fs');
const async = require('async');
const sinon = require('sinon');
const assert = require('chai').assert;
const jsrsasign = require('jsrsasign');

/** Заглушка компонента журналирования */
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

describe('PKI', function () {
  describe('#keypair()', function () {
    require('../')(options, imports, (error, returns) => {
      const pki = returns.pki;
      it('should throw error if unable to generate keypair', function (done) {
        const err = new Error('Error');
        const stub = sinon.stub(jsrsasign.KEYUTIL, 'generateKeypair').throws(err);
        pki.keypair(undefined, (requestError) => {
          assert.instanceOf(requestError, Error);
          assert.equal(requestError, err);
          stub.restore();
          return done();
        });
      });
      it('should use provided keyalg and keylen', function (done) {
        const err = new Error('Error');
        const stub = sinon.stub(jsrsasign.KEYUTIL, 'generateKeypair').throws(err);
        pki.keypair({ keyalg: 'RSA', keylen: 2048 }, (requestError) => {
          assert.instanceOf(requestError, Error);
          assert.equal(requestError, err);
          stub.restore();
          return done();
        });
      });
      it.skip('should generate keypair', function (done) {
        this.timeout(10000);
        pki.keypair(undefined, (requestError, requestResult) => {
          assert.isNull(requestError);
          assert.instanceOf(requestResult, Object);
          return done();
        });
      });
    });
  });

  describe('#request()', function () {
    require('../')(options, imports, (error, returns) => {
      const pki = returns.pki;
      it('should work?', function (done) {
        this.timeout(10000);
        pki.request({ cn: 'ezaitsev', mail: 'ezaitsev@briskhome.com' }, (csrError, csrResult) => {
          console.log(csrError, csrResult);
        });
        return done();
      });
    });
  });
});
