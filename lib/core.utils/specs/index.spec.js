/**
 * @briskhome
 * └core.utils <lib/core.utils/specs/index.spec.js>
 *
 * @author  Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const db = require('mongoose');
const sinon = require('sinon');
const assert = require('chai').assert;
const mockgoose = require('mockgoose');

const Device = require('../../core.db/models/device.model.js')(db);
const Sensor = require('../../core.db/models/sensor.model.js')(db);
const Reading = require('../../core.db/models/reading.model.js')(db);

sinon.assert.expose(assert, { prefix: '' });
mockgoose(db).then(() => {
  db.connect('mongodb://briskhome:briskhome@localhost/test');
});

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
  db,
  log: () => new Log(),
};

describe('#devices()', function () {
  require('../')(options, imports, (error, returns) => {
    const component = returns.sensors;

    it('should set service when provided', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(null, [{ foo: 'bar' }]);
      component.devices({ service: 'onewire' }, () => {
        stub.restore();
        return done();
      });
    });

    it('should set id when provided', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(null, [{ foo: 'bar' }]);
      component.devices({ id: 'foobar' }, () => {
        stub.restore();
        return done();
      });
    });

    it('should yield all devices', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(null, [{ foo: 'bar' }]);
      component.devices(null, () => {
        stub.restore();
        return done();
      });
    });

    it('should yield error when unable to query', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(new Error('Foo'));
      component.devices(null, (err) => {
        assert.instanceOf(err, Error);
        assert.calledOnce(logWarnStub);
        logWarnStub.reset();
        stub.restore();
        return done();
      });
    });

    it('should yield null when no devices found', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(null, []);
      component.devices(null, (err, data) => {
        assert.isNull(err);
        assert.isUndefined(data);
        assert.calledOnce(logWarnStub);
        logWarnStub.reset();
        stub.restore();
        return done();
      });
    });
  });
});

describe('#sensors()', function () {
  require('../')(options, imports, (error, returns) => {
    const component = returns.sensors;

    it('should yield all sensors', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(null, [{ foo: 'bar' }]);
      component.sensors(null, null, (queryErr, queryRes) => {
        assert.isNull(queryErr);
        assert.isNotNull(queryRes);
        assert.calledOnce(stub);
        stub.restore();
        return done();
      });
    });

    it('should yield a specific sensor when provided with UUID', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(null, { foo: 'bar' });
      component.sensors('foo', null, (queryErr, queryRes) => {
        assert.isNull(queryErr);
        assert.isNotNull(queryRes);
        assert.calledOnce(stub);
        stub.restore();
        return done();
      });
    });

    it('should accept configuration options', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(new Error('MongoError'));
      component.sensors('foo', { plain: true }, (queryErr) => {
        assert.instanceOf(queryErr, Error);
        assert.calledOnce(stub);
        stub.restore();
        return done();
      });
    });

    it('should yield error when unable to perform query', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(new Error('MongoError'));
      component.sensors('foo', null, (queryErr) => {
        assert.instanceOf(queryErr, Error);
        assert.calledOnce(stub);
        stub.restore();
        return done();
      });
    });
  });
});

describe('#readings()', function () {
  require('../')(options, imports, (error, returns) => {
    const component = returns.sensors;

    it.skip('should yield all readings', function (done) {
      const stub = sinon.stub(db.Query.prototype, 'exec').yields(null, [{ foo: 'bar' }]);
      component.readings({}, (queryErr, queryRes) => {
        assert.isNull(queryErr);
        assert.isNotNull(queryRes);
        assert.calledOnce(stub);
        stub.restore();
        return done();
      });
    });
  });
});

describe('#processRawData()', function () {
  require('../')(options, imports, (error, returns) => {
    const component = returns.sensors;

    it('should yield error when unable to query a sensor', function (done) {
      const sensorsStub = sinon.stub(component, 'sensors').yields(new Error('MongoError'));
      component.processRawData({}, (processErr) => {
        assert.instanceOf(processErr, Error);
        sensorsStub.restore();
        return done();
      });
    });

    it('should yield error when unable to save a sensor', function (done) {
      const sensor = new Sensor();
      sensor.values = [];
      const saveStub = sinon.stub(sensor, 'save').yields(new Error('MongoError'));
      const sensorsStub = sinon.stub(component, 'sensors').yields(null, sensor);
      component.processRawData({ values: { temperature: 0 } }, (processErr) => {
        assert.instanceOf(processErr, Error);
        sensorsStub.restore();
        saveStub.restore();
        return done();
      });
    });

    it('should yield error when unable to query a reading', function (done) {
      const sensor = new Sensor();
      const saveStub = sinon.stub(sensor, 'save').yields(null);
      const sensorsStub = sinon.stub(component, 'sensors').yields(null, sensor);
      const readingsStub = sinon.stub(component, 'readings').yields(new Error('MongoError'));
      component.processRawData({ values: { temperature: 0 } }, (processErr) => {
        assert.instanceOf(processErr, Error);
        readingsStub.restore();
        sensorsStub.restore();
        saveStub.restore();
        return done();
      });
    });

    it('should yield error when unable to save a reading', function (done) {
      const sensor = new Sensor();
      const reading = new Reading();
      reading.values = [];
      const saveSensorStub = sinon.stub(sensor, 'save').yields(null);
      const saveReadingStub = sinon.stub(reading, 'save').yields(new Error('MongoError'));
      const sensorsStub = sinon.stub(component, 'sensors').yields(null, sensor);
      const readingsStub = sinon.stub(component, 'readings').yields(null, reading);
      component.processRawData({ values: { temperature: 0 } }, (processErr) => {
        assert.instanceOf(processErr, Error);
        readingsStub.restore();
        sensorsStub.restore();
        saveSensorStub.restore();
        saveReadingStub.restore();
        return done();
      });
    });

    // it('should create a sensor when unable to find one', function (done) {
    //   const saveStub = sinon.stub(Sensor.prototype, 'save').yields(new Error('MongoError'));
    //   const sensorsStub = sinon.stub(component, 'sensors').yields(null, null);
    //   component.processRawData({ values: { temperature: 0 } }, (processErr) => {
    //     assert.instanceOf(processErr, Error);
    //     sensorsStub.restore();
    //     saveStub.restore();
    //     return done();
    //   });
    // });

    it('should create a sensor and a reading when necessary', function (done) {
      const sensorSaveStub = sinon.stub(Sensor.prototype, 'save').yields(null);
      const readingSaveStub = sinon.stub(Reading.prototype, 'save').yields(new Error('MongoError'));
      const sensorsStub = sinon.stub(component, 'sensors').yields(null, null);
      const readingsStub = sinon.stub(component, 'readings').yields(null, null);
      component.processRawData({ values: { temperature: 0 } }, (processErr) => {
        assert.instanceOf(processErr, Error);
        sensorsStub.restore();
        sensorSaveStub.restore();
        readingsStub.restore();
        readingSaveStub.restore();
        return done();
      });
    });

    it('should yield null on success', function (done) {
      const sensorSaveStub = sinon.stub(Sensor.prototype, 'save').yields(null);
      const readingSaveStub = sinon.stub(Reading.prototype, 'save').yields(null);
      const sensorsStub = sinon.stub(component, 'sensors').yields(null, null);
      const readingsStub = sinon.stub(component, 'readings').yields(null, null);
      component.processRawData({ values: { temperature: 0 } }, (processErr) => {
        assert.isNull(processErr);
        sensorsStub.restore();
        sensorSaveStub.restore();
        readingsStub.restore();
        readingSaveStub.restore();
        return done();
      });
    });
  });
});
