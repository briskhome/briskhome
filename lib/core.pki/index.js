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
const spawn = require('child_process').spawn;

const forge = require('node-forge');

module.exports = function setup(options, imports, register) {
  const log = imports.log('core.pki');

  /**
   *
   */
  function PKI() {

  }

  /**
   * #generateRequest() Creates a certificate signing request (CSR) and stores it in a database.
   * The CSR then needs to be approved by a system administrator for a certificate to be issued.
   * All data properties are optional except `data.cn` and `data.mail`.
   *
   * @param {Object} data
   * @param {Object} data.subject
   * @param {String} data.subject.cn  2 character country code defined in ISO 3166
   * @param {String} data.subject.st  State or province name
   * @param {String} data.subject.l   Locality name
   * @param {String} data.subject.o   Organization name or even organisational name
   * @param {String} data.subject.ou  Usually department or any sub entity
   * @param {String} data.subject.cn  Common name
   * @param {String} data.subject.e   Email address
   *
   * @callback cb
   */
  PKI.prototype.generateRequest = function generateRequest(data, cb) {
    if (!data || !Object.prototype.hasOwnProperty.call(data, 'subject')) {
      const dataErr = new Error('Unable to generate CSR - no data object passed in');
      log.warn({ err: dataErr }, dataErr.message);
      return cb(dataErr);
    }

    const subject = data.subject;
    const attrs = Object.prototype.hasOwnProperty.call(data, 'attrs') ? data.attrs : undefined;

    return forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (keypairErr, keypair) => {
      if (keypairErr) {
        log.error({ err: keypairErr }, 'Unable to generate keypair');
        return cb(keypairErr);
      }

      const csr = forge.pki.createCertificationRequest();
      const subjectArray = [];

      for (let i = 0; i < Object.keys(subject).length; i++) {
        const name = Object.keys(subject)[i];
        const value = subject[name];
        const entry = { shortName: name.toUpperCase(), value };
        subjectArray.push(entry);
      }

      csr.publicKey = keypair.publicKey;
      csr.setSubject(subjectArray);

      if (attrs) {
        csr.setAttributes(attrs);
      }

      csr.sign(keypair.privateKey);
      const pem = forge.pki.certificationRequestToPem(csr);
      return fs.writeFile(`csr/${subject.cn}.csr`, pem, (writeErr) => {
        if (writeErr) {
          log.warn(writeErr, writeErr.message);
          return cb(writeErr);
        }

        return cb(null, pem);
      });
    });
  };

  /**
   * #verifyRequest()
   * @param {Pem} pem  Certificate signing request in a PEM format
   *
   * @returns {Boolean}
   */
  PKI.prototype.verifyRequest = function verifyRequest(pem) {
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
  PKI.prototype.issueCertificate = function issue(data, cb) {
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

  /**
   * #signData()
   * @param {Object} data  [description]
   *
   * @callback cb
   */
  PKI.prototype.signData = function sign(data, cb) {
    if (!data
      || !Object.prototype.hasOwnProperty.call(data, 'signer')
      || !Object.prototype.hasOwnProperty.call(data, 'inkey')
      || !Object.prototype.hasOwnProperty.call(data, 'certfile')
    ) {
      const dataErr = new Error('No data object or some of required attributes provided');
      log.error({ err: dataErr }, dataErr.message);
      return cb(dataErr);
    }

    let command = `openssl smime -sign -text -nodetach -outform der -binary
      -signer ${data.signer}
      -inkey ${data.inkey}
      -certfile ${data.certfile} `;

    if (data.password) {
      command += `-passin pass:${data.password} `;
    }

    const der = [];
    const args = command.split(' ');
    const child = spawn(args[0], args.splice(1));

    child.stdout.on('data', (chunk) => {
      der.push(chunk);
    });

    return child.on('close', (code) => {
      if (code !== 0) {
        const commandError = new Error('Error');
        log.error({ err: commandError }, commandError.message);
        return cb(commandError);
      }

      return cb(null, der);
    });
  };

  register(null, { pki: new PKI() });
};
