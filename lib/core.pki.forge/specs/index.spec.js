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
const forge = require('node-forge');
const assert = require('chai').assert;

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
  describe('#generateRequest()', function () {
    require('../')(options, imports, (error, returns) => {
      const pki = returns.pki;
      it('should throw if unable to generate a CSR', function (done) {
        this.timeout(10000);
        const generateError = new Error('Error');
        const stub = sinon.stub(forge.pki.rsa, 'generateKeyPair').yields(generateError);
        pki.generateRequest(null, (csrError) => {
          assert.instanceOf(csrError, Error);
          stub.restore();
          return done();
        });
      });
      it.skip('should ...', function (done) {

      });
      it('should generate a CSR', function (done) {
        this.timeout(10000);
        pki.generateRequest(null, (csrError, csr) => {
          return done();
        });
      });
    });
  });

  describe('#verifyRequest()', function () {
    require('../')(options, imports, (error, returns) => {
      const pki = returns.pki;
      it('should verify a proper CSR', function (done) {
        this.timeout(10000);
        pki.generateRequest(null, (csrError, csr) => {
          const verified = pki.verifyRequest(csr);
          assert.equal(verified, true);
          return done();
        });
      });
    });
  });
});
