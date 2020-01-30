/**
 * @briskhome
 * └core.pki <specs/index.spec.js>
 */
// import fs from 'fs';
// import forge from 'node-forge';
import plugin from "../";
jest.unmock("../");
jest.unmock('node-forge');
describe('core.pki', () => {
  let sut;
  let err;
  let options;
  let imports; // const mockError = new Error('MockError');

  const log = () => ({
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    child: jest.fn()
  });

  beforeEach(() => {
    err = undefined;
    options = {};
    imports = {
      log
    };
  });
  beforeEach(() => {
    sut = plugin(imports, options);
  });
  describe('#generateRequest()', () => {
    it('should yield error if no data object is provided', async () => {
      try {
        await sut.generateRequest();
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('should yield error if no subject is provided', async () => {
      try {
        await sut.generateRequest({
          foo: 'bar'
        });
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it.skip('should yield error if unable to generate a CSR', async () => {// forge.mockReturnValueOnce({ pki: { rsa: {
      //   generateRequest: jest.fn().mockImplementationOnce(() => { throw mockError; }),
      // } } });
      //
      // try {
      //   await sut.generateRequest({ subject: { cn: 'foo', mail: 'foo@bar.com' } });
      // } catch (e) { err = e; }
      // expect(err).toEqual(mockError);
    });
    it.skip('should yield error if unable to verify a CSR', async () => {// const csr = forge.pki.createCertificationRequest();
      // csr.verify = jest.fn().mockImplementationOnce(() => { throw mockError; });
      // const subject = {
      //   C: 'FB',
      //   ST: 'Foo',
      //   L: 'Bar',
      //   O: 'FOOBAR',
      //   CN: 'Foo Bar',
      //   E: 'foo@bar.fb',
      // };
      //
      // try { await sut.generateRequest({ subject }); } catch (e) { err = e; }
      // expect(err).toEqual(mockError);
    });
    it.skip('should yield error if unable to save a CSR', () => {// const stubErr = new Error('Error');
      // const stub = sinon.stub(fs, 'writeFile').yields(stubErr);
      // const subject = {
      //   C: 'FB',
      //   ST: 'Foo',
      //   L: 'Bar',
      //   O: 'FOOBAR',
      //   CN: 'Foo Bar',
      //   E: 'foo@bar.fb',
      // };
      //
      // sut.generateRequest({ subject }, (csrError) => {
      //   assert.equal(csrError, stubErr);
      //   stub.restore();
      //   return done();
      // });
    });
    it.skip('should yield a CSR', () => {// const stub = sinon.stub(fs, 'writeFile').yields(null);
      // const subject = {
      //   c: 'FB',
      //   st: 'Foo',
      //   l: 'Bar',
      //   o: 'FOOBAR',
      //   cn: 'Foo Bar',
      //   e: 'foo@bar.fb',
      // };
      //
      // sut.generateRequest({ subject }, (csrError, csr) => {
      //   if (csrError) return done(csrError);
      //   assert.isNotNull(csr);
      //   stub.restore();
      //   return done();
      // });
    });
  });
  describe('#issueCertificate()', () => {
    it('should verify a proper CSR');
  });
  describe('#signData()', () => {
    it('should yield error if no data object is provided', async () => {
      try {
        await sut.signData();
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('No data object or some of required attributes provided');
    });
    it('should yield error if no signer info is provided', async () => {
      try {
        await sut.signData({
          inkey: 'foo',
          certfile: 'bar'
        });
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('No data object or some of required attributes provided');
    });
    it('should yield error if no inkey is provided', async () => {
      try {
        await sut.signData({
          signer: 'foo',
          certfile: 'bar'
        });
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('No data object or some of required attributes provided');
    });
    it('should yield error if no certfile is provided', async () => {
      try {
        await sut.signData({
          signer: 'foo',
          inkey: 'bar'
        });
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('No data object or some of required attributes provided');
    });
    it('should append password when provided', async () => {
      try {
        await sut.signData({
          signer: 'foo',
          inkey: 'bar',
          certfile: 'foo',
          password: 'bar'
        });
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
    it('should yield error if unable to sign data', async () => {
      try {
        await sut.signData({
          signer: 'foo',
          inkey: 'bar',
          certfile: 'foobar'
        });
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });
  });
});