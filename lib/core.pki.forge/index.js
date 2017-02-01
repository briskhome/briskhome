/**
 * @briskhome/core.pki <lib/core.pki/index.js>
 *
 * Компонент инфраструктуры публичных ключей.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

const fs = require('fs');

const forge = require('node-forge');

module.exports = function setup(options, imports, register) {
  const log = imports.log('core.pki');

  /**
   *
   */
  function PKI() {

  }

  /**
   * #keypair() Generates a pair of private and public keys and stores them in a database (?).
   *
   * @param {Object} data
   * @param {String} data.keyalg
   * @param {String} data.keylen
   *
   * @callback cb
   */
  // PKI.prototype.keypair = function keypair(data, cb) {
  //
  // };

  /**
   * #request() Creates a certificate signing request (CSR) and stores it in a database. The CSR
   * then needs to be approved by a system administrator for a certificate to be issued. All data
   * properties are optional except `data.cn` and `data.mail`.
   *
   * @param {Object} data       Hash of options
   * @param {String} data.c     2 character country code defined in ISO 3166
   * @param {String} data.st    State or province name
   * @param {String} data.l     Locality name
   * @param {String} data.o     Organization name or even organisational name
   * @param {String} data.ou    Usually department or any sub entity of larger entity
   * @param {String} data.cn    Common name
   * @param {String} data.mail  Email address
   *
   * @callback cb
   */
  PKI.prototype.generateRequest = function generateRequest(data, cb) {
    forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (keypairError, keypair) => {
      if (keypairError) {
        log.error({ err: keypairError }, 'Unable to generate keypair');
        return cb(keypairError);
      }

      const csr = forge.pki.createCertificationRequest();
      csr.publicKey = keypair.publicKey;

      csr.setSubject([{
        name: 'commonName',
        value: 'example.org',
      }, {
        name: 'countryName',
        value: 'US',
      }, {
        shortName: 'ST',
        value: 'Virginia',
      }, {
        name: 'localityName',
        value: 'Blacksburg',
      }, {
        name: 'organizationName',
        value: 'Test',
      }, {
        shortName: 'OU',
        value: 'Test',
      }]);

      csr.setAttributes([{
        name: 'challengePassword',
        value: 'password',
      }, {
        name: 'unstructuredName',
        value: 'My Company, Inc.',
      }, {
        name: 'extensionRequest',
        extensions: [{
          name: 'subjectAltName',
          altNames: [{
            // 2 is DNS type
            type: 2,
            value: 'test.domain.com',
          }, {
            type: 2,
            value: 'other.domain.com',
          }, {
            type: 2,
            value: 'www.domain.net',
          }],
        }],
      }]);

      csr.sign(keypair.privateKey);
      const pem = forge.pki.certificationRequestToPem(csr);
      return cb(null, pem);
    });
  };

  PKI.prototype.verifyRequest = function verifyRequest(pem, cb) {
    const csr = forge.pki.certificationRequestFromPem(pem);
    return csr.verify();
  };

  /**
   * #issue() Issues a certificate based on a previously generated CRS and private key that are
   * stored in a database.
   *
   * @param {Object} data
   * @param {String} data.issuer      One of the following: bcca, buca
   * @param {String} data.notBefore   Time string in the following format: `130511235959Z`
   * @param {String} data.notAfter
   * @param {Object} data.extensions
   *
   * @callback cb
   */
  PKI.prototype.issue = function issue(data, cb) {
    var keys = pki.rsa.generateKeyPair(2048);
    var cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    // alternatively set public key from a csr
    //cert.publicKey = csr.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var attrs = [{
      name: 'commonName',
      value: 'example.org'
    }, {
      name: 'countryName',
      value: 'US'
    }, {
      shortName: 'ST',
      value: 'Virginia'
    }, {
      name: 'localityName',
      value: 'Blacksburg'
    }, {
      name: 'organizationName',
      value: 'Test'
    }, {
      shortName: 'OU',
      value: 'Test'
    }];
    cert.setSubject(attrs);
    // alternatively set subject from a csr
    //cert.setSubject(csr.subject.attributes);
    cert.setIssuer(attrs);
    cert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    }, {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    }, {
      name: 'subjectAltName',
      altNames: [{
        type: 6, // URI
        value: 'http://example.org/webid#me'
      }, {
        type: 7, // IP
        ip: '127.0.0.1'
      }]
    }, {
      name: 'subjectKeyIdentifier'
    }]);
    /* alternatively set extensions from a csr
    var extensions = csr.getAttribute({name: 'extensionRequest'}).extensions;
    // optionally add more extensions
    extensions.push.apply(extensions, [{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }]);
    cert.setExtensions(extensions);
    */
    // self-sign certificate
    cert.sign(keys.privateKey);

    // convert a Forge certificate to PEM
    var pem = pki.certificateToPem(cert);
  };

  register(null, { pki: new PKI() });
};
