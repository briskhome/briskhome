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

const r = require('jsrsasign');
const jsrsasign = require('jsrsasign');

module.exports = function setup(options, imports, register) {
  const log = imports.log('core.pki');

  /**
   *
   */
  function PKI() {
    // const CAPrivateKey = '';
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
  PKI.prototype.keypair = function keypair(data, cb) {
    /** @todo Need to check other supported sigalg and keyalg values */
    const keyalg = data && Object.prototype.hasOwnProperty.call(data, 'keyalg')
      ? data.keyalg
      : 'RSA';
    const keylen = data && Object.prototype.hasOwnProperty.call(data, 'keylen')
      ? data.keyalg
      : 2048;
    try {
      const kp = jsrsasign.KEYUTIL.generateKeypair(keyalg, keylen);
      return cb(null, kp);
    } catch (ex) {
      log.error({ err: ex }, 'Unable to generate keypair');
      return cb(ex);
    }
  };

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
  PKI.prototype.request = function request(data, cb) {
    if (!data) return cb(new Error('No parameters defined'));
    if (!Object.prototype.hasOwnProperty.call(data, 'cn')) return cb(new Error('No Common Name'));
    if (!Object.prototype.hasOwnProperty.call(data, 'mail')) return cb(new Error('No Email'));

    const c = data.c || 'RU';
    const st = data.st;
    const l = data.l || 'Zaokskiy';
    const o = data.o || 'BRISKHOME';
    const ou = data.ou;
    const cn = data.cn;
    const mail = data.mail;

    let subject = '';
    if (c) subject += `/C=${c}`;
    if (st) subject += `/ST=${st}`;
    if (l) subject += `/L=${l}`;
    if (o) subject += `/O=${o}`;
    if (ou) subject += `/OU=${ou}`;

    subject += `/CN=${cn}`;
    subject += `/MAIL=${mail}`;

    const sigalg = 'SHA256withRSA';
    try {
      return this.keypair({}, (keypairError, kp) => {
        console.log(Object.keys(kp));
        // const key = jsrsasign.KEYUTIL.getPEM(kp.prvKeyObj, 'PKCS8PRV');
        const csr = jsrsasign.KJUR.asn1.csr.CSRUtil.newCSRPEM({
          subject: { str: subject },
          sbjpubkey: kp.pubKeyObj,
          sigalg,
          sbjprvkey: kp.prvKeyObj,
        });

        return cb(null, { /*csr,*/ key }); // Should not return nothing at all. No error, nothing.
      });
    } catch (ex) {
      // log.error({ err: ex }, 'Unable to create certificate signing request');
      console.log(ex);
      return cb(ex);
    }
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

    /*
        options = {
          ca: boolean, ?false
          'self-sign': ?false
          issuer:      ?bcca
          notBefore:
          notAfter:
          subject:
        }
     */

    if (options && !Object.prototype.hasOwnProperty.call(data, 'self-sign')) {
      const keypair = r.KEYUTIL.generateKeypair("RSA", 1024);
    }

    console.log(keypair);
    const tbsc = new r.asn1.x509.TBSCertificate();

    /*
      Серийный номер должен быть следующим за последним выпущенным сертификатом.
      const serial = db.model('Certificate').findOne().sort('-serial').exec(function(err, item) {

      });
    */

    tbsc.setSerialNumberByParam({'int': 1234});
    tbsc.setSignatureAlgByParam({'name': 'SHA256withRSA'});
    tbsc.setIssuerByParam({'str': "C=RU, ST=Russia, L=Zaokskiy, O=Briskhome, CN=Корневой удостоверяющий центр Briskhome/emailAddress=ca@briskhome.com"});
    tbsc.setNotBeforeByParam({'str': "130511235959Z"});
    tbsc.setNotAfterByParam({'str': "150511235959Z"});
    tbsc.setSubjectByParam({'str': "/C=US/O=Test/CN=User1"});
    tbsc.setSubjectPublicKeyByParam({'rsapem': "----BEGIN PUBLIC KEY(snip)"});

    tbsc.appendExtension(new r.asn1.x509.BasicConstraints({'cA': false}));
    tbsc.appendExtension(new r.asn1.x509.KeyUsage({'bin':'11'}));
    tbsc.appendExtension(new r.asn1.x509.CRLDistributionPoints({'uri':'http://a.com/a.crl'}));

    var cert = new r.asn1.x509.Certificate({'tbscertobj': tbsc, 'rsaprvpem': '----BEGIN RSA PRIVATE KEY(snip)', 'rsaprvpas': 'password'});
    cert.sign();
    var certPEM = cert.getPEMString();
    fs.writeFileSync(certPEM, 'certs/demo.pem');
  };

  register(null, { pki: new PKI() });
};
