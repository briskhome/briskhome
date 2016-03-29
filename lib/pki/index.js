/**
 * Briskhome house monitoring service.
 * -- public key infrastructure library.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const forge = require('node-forge');

const DEFAULT = {
  commonName: '',
  countryName: 'RU',
  stateOrProvinceName: 'Russia',
  localityName: 'Zaokskiy',
  organizationName: 'Briskhome',
};

/*
  These are some proposals for the future. As of right now (28.12.2015) this
  module is not stable and/or functional yet.
    [ ] Rename module to `briskhome-certificates`.
    [ ] Move `briskhome-certificates` to a separate module.
*/

/**
 * The Certificate class defines a container that keeps a single certificate.
 * Certificates can be created, prolonged or validated. Every created
 * certificate is signed by BUCA intermediate certificate authority.
 *
 * @constructor
 */

function Certificate() {
  console.log(db);
  console.log(log);
  return this;
}

/**
 * Create certificate function.
 *
 *
 * @param <Object> options Configuration object. List of possible options:
 *        - attributes <Object>
 *        - validity <Date>
 *        - extensions <Object>
 *        - ...
 */

Certificate.prototype.create = function(options) {
  console.log('In certificate creation.');
  verifyOptions(options, function(err) {
    if (err) {
      throw new Error('Certificate configuration object is misconfigured.');
    }
  });

  // Log: log.info('Certificate generation requested by ' + name + '.');
  var keys = forge.pki.rsa.generateKeyPair(1024);

  // Preparations for certificate generation. Step-by-step explanation of the
  // process and arguments:
  // Serial number.
  //    Serial numbers, as well as public keys of all certificates, are stored
  //    in MongoDB. Last serial number is fetched from database by special
  //    function and incremented by 1. Attention: race condition is probable.
  // Validity.
  //    A certificate MUST NOT be valid before its issued. Expiration date
  //    SHOULD either be common for every user certificate or it should be
  //    passed in.
  var cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = 1; // SerialNumber(); // FIXME: this.serialNumber()?

  // TODO: validity should be configurable both by parameters and predefined
  // `due date` (default).
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  // TODO: attributes should be configurable by parameters.
  var attrs = [
    {
      name: 'commonName',
      value: 'example.org',
    }, {
      name: 'countryName',
      value: 'RU',
    }, {
      shortName: 'ST',
      value: 'Russia',
    }, {
      name: 'localityName',
      value: 'Zaokskiy',
    }, {
      name: 'organizationName',
      value: 'Briskhome',
    },
  ];
  cert.setSubject(attrs);

  // TODO: predefine issuer attributes. Take them from BUCA certificate?
  cert.setIssuer(attrs);

  // FIXME: add authorityKeyIdentifier extension
  // TODO: check extensions, they should match the default configuration.
  // Also, a special administrator extension should be able to be applied.
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true,/*,
    pathLenConstraint: 4*/
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true,
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true,
  },/* {
    name: 'subjectAltName',
    altNames: [{
      type: 6, // URI
      value: 'http://example.org/webid#me',
    }, {
      type: 7, // IP
      ip: '127.0.0.1',
    },],

  },*/ {
    name: 'subjectKeyIdentifier',
  },]);

  // TODO: sign certificate with BUCA
  cert.sign(keys.privateKey/*, forge.md.sha256.create()*/);

  // PEM-format keys and cert
  var pem = {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert),
  };
  return this;
};

Certificate.prototype.verify = function(cert) {
  var caStore = forge.pki.createCaStore();
  caStore.addCertificate(cert);
  try {
    forge.pki.verifyCertificateChain(caStore, [cert],
      function(vfd, depth, chain) {
        if (vfd === true) {
          log.info('SubjectKeyIdentifier verified: ' +
            cert.verifySubjectKeyIdentifier());
          log.info('Certificate verified.');
        }
        return true;
      });
  } catch (ex) {
    log.info('Certificate verification failure: ' +
      JSON.stringify(ex, null, 2));
  }
};

function verifyOptions(options) {

}

function serialNumber() {
  var serial;

  // Fetch latest serial value.


  return serial;
}

module.exports = {
  create: function(options) {
    return new Certificate().create(options);
  },
  verify: function(certificate) {
    return this.verify(certificate); // Does it work? Need to test!
  },
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //

// Create certificate with Forge

var createCertificate = function() {
  log.info('Generating 1024-bit key-pair...');
  var keys = forge.pki.rsa.generateKeyPair(1024);
  log.info('Key-pair created.');

  log.info('Creating self-signed certificate...');
  var cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  var attrs = [{
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
  },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true,/*,
    pathLenConstraint: 4*/
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true,
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true,
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 6, // URI
      value: 'http://example.org/webid#me',
    }, {
      type: 7, // IP
      ip: '127.0.0.1',
    },],
  }, {
    name: 'subjectKeyIdentifier',
  },]);
  // FIXME: add authorityKeyIdentifier extension

  // Self-sign certificate
  cert.sign(keys.privateKey/*, forge.md.sha256.create()*/);
  log.info('Certificate created.');

  // PEM-format keys and cert
  var pem = {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert),
  };

  log.info('\nKey-Pair:');
  log.info(pem.privateKey);
  log.info(pem.publicKey);

  log.info('\nCertificate:');
  log.info(pem.certificate);

  // Verify certificate
  var caStore = forge.pki.createCaStore();
  caStore.addCertificate(cert);
  try {
    forge.pki.verifyCertificateChain(caStore, [cert],
      function(vfd, depth, chain) {
        if (vfd === true) {
          log.info('SubjectKeyIdentifier verified: ' +
            cert.verifySubjectKeyIdentifier());
          log.info('Certificate verified.');
        }
        return true;
      });
  } catch (ex) {
    log.info('Certificate verification failure: ' +
      JSON.stringify(ex, null, 2));
  }
};
