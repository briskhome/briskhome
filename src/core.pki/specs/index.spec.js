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

describe('#generateRequest()', function () {
  require('../')(options, imports, (error, returns) => {
    const pki = returns.pki;

    it('should yield error if no data object is provided', function (done) {
      pki.generateRequest(null, (csrError) => {
        assert.instanceOf(csrError, Error);
        return done();
      });
    });

    it('should yield error if no subject is provided', function (done) {
      pki.generateRequest({ foo: 'bar' }, (csrError) => {
        assert.instanceOf(csrError, Error);
        return done();
      });
    });

    it('should yield error if unable to generate a CSR', function (done) {
      this.timeout(10000);
      const stubErr = new Error('Error');
      const stub = sinon.stub(forge.pki.rsa, 'generateKeyPair').yields(stubErr);
      pki.generateRequest({ subject: { cn: 'foo', mail: 'foo@bar.com' } }, (csrError) => {
        assert.equal(csrError, stubErr);
        stub.restore();
        return done();
      });
    });

    it.skip('should yield error if unable to verify a CSR', function (done) {
      this.timeout(10000);
      const csr = forge.pki.createCertificationRequest();
      const stubErr = new Error('Error');
      const stub = sinon.stub(csr, 'verify').yields(stubErr);
      const subject = {
        C: 'FB',
        ST: 'Foo',
        L: 'Bar',
        O: 'FOOBAR',
        CN: 'Foo Bar',
        E: 'foo@bar.fb',
      };

      pki.generateRequest({ subject }, (csrError) => {
        assert.equal(csrError, stubErr);
        stub.restore();
        return done();
      });
    });

    it('should yield error if unable to save a CSR', function (done) {
      this.timeout(10000);
      const stubErr = new Error('Error');
      const stub = sinon.stub(fs, 'writeFile').yields(stubErr);
      const subject = {
        C: 'FB',
        ST: 'Foo',
        L: 'Bar',
        O: 'FOOBAR',
        CN: 'Foo Bar',
        E: 'foo@bar.fb',
      };

      pki.generateRequest({ subject }, (csrError) => {
        assert.equal(csrError, stubErr);
        stub.restore();
        return done();
      });
    });

    it('should yield a CSR', function (done) {
      this.timeout(10000);
      const stub = sinon.stub(fs, 'writeFile').yields(null);
      const subject = {
        c: 'FB',
        st: 'Foo',
        l: 'Bar',
        o: 'FOOBAR',
        cn: 'Foo Bar',
        e: 'foo@bar.fb',
      };

      pki.generateRequest({ subject }, (csrError, csr) => {
        if (csrError) return done(csrError);
        assert.isNotNull(csr);
        stub.restore();
        return done();
      });
    });
  });
});

describe('#issueCertificate()', function () {
  require('../')(options, imports, (error, returns) => {
    const pki = returns.pki;
    it.skip('should verify a proper CSR', function (done) {

    });
  });
});

describe('#signData()', function () {
  require('../')(options, imports, (error, returns) => {
    const pki = returns.pki;
    it('should yield error if no data object is provided', function (done) {
      this.timeout(10000);
      pki.signData(null, (dataError) => {
        assert.instanceOf(dataError, Error);
        return done();
      });
    });

    it('should yield error if no signer info is provided', function (done) {
      this.timeout(10000);
      pki.signData({ inkey: 'foo', certfile: 'bar' }, (dataError) => {
        assert.instanceOf(dataError, Error);
        return done();
      });
    });

    it('should yield error if no inkey is provided', function (done) {
      this.timeout(10000);
      pki.signData({ signer: 'foo', certfile: 'bar' }, (dataError) => {
        assert.instanceOf(dataError, Error);
        return done();
      });
    });

    it('should yield error if no certfile is provided', function (done) {
      this.timeout(10000);
      pki.signData({ signer: 'foo', inkey: 'bar' }, (dataError) => {
        assert.instanceOf(dataError, Error);
        return done();
      });
    });

    it('should append password when provided', function (done) {
      this.timeout(10000);
      pki.signData({ signer: 'foo', inkey: 'bar', certfile: 'foo', password: 'bar' }, (dataError) => {
        assert.instanceOf(dataError, Error);
        return done();
      });
    });

    it('should yield error if unable to sign data', function (done) {
      this.timeout(10000);
      pki.signData({ signer: 'foo', inkey: 'bar', certfile: 'foobar' }, (dataError) => {
        assert.instanceOf(dataError, Error);
        return done();
      });
    });
  });
});
