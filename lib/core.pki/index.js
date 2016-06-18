/**
 * @briskhome/core.pki <lib/core.pki/index.js>
 *
 * Компонент инфраструктуры публичных ключей.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

const r = require('jsrsasign');

module.exports = function (options, imports, register) {

  /**
   *
   */
  function CA () {
    const CAPrivateKey = '';
  }

  /**
   *
   *
   */
  CA.prototype.issueCertificate = function (options) {


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

    if (options.hasOwnProperty('self-sign')) {
      const keypair = r.KEYUTIL.generateKeypair("RSA", 1024);
    }
    let tbsc = new r.asn1.x509.TBSCertificate();

    // Серийный номер должен быть следующим за последним выпущенным сертификатом.
    // const serial = db.model('Certificate').findOne().sort('-serial').exec(function(err, item) {
    //
    // });

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

  };


  register(null, null);
};
