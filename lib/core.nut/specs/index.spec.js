/* global after, afterEach, before, beforeEach, describe, it */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint global-require: [0] */
/* eslint func-names: [0] */
/* eslint prefer-arrow-callback: [0] */

'use strict';

const db = require('mongoose');
const async = require('async');
const sinon = require('sinon');
const stubs = require('./stubs.js');
const assert = require('chai').assert;
const mockgoose = require('mockgoose');
const EventEmitter = require('events');

const Device = require('../../core.db/models/device.model.js')(db);
// const Sensor = require('../../core.db/models/sensor.model.js')(db);
// const Reading = require('../../core.db/models/reading.model.js')(db);

sinon.assert.expose(assert, { prefix: '' });
mockgoose(db).then(function () {
  db.connect('mongodb://briskhome:briskhome@localhost/test');
});

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
  this.trace = logFatalStub;
}

const imports = {
  db,
  bus: new EventEmitter(),
  config: () => {},
  log: () => new Log(),
};

describe('Ups', function () {
  describe('#init()', function () {
    beforeEach(function (done) {
      Device.collection.insert(
        stubs.devices[0],
        () => done()
      );
    });
    afterEach(function (done) {
      Device.collection.remove(
        {},
        () => done()
      );
    });

    it('should log a warning and return error if unable to query devices', function (done) {
      const deviceFindStub = sinon.stub(db.Query.prototype, 'exec').yields(new Error('MongoError'));
      require('../')({}, imports, (error, returns) => {
        const ups = returns.ups;
        ups.init((initErr) => {
          assert.instanceOf(initErr, Error);
          assert.calledOnce(logWarnStub);
          assert.calledWith(logWarnStub,
            sinon.match({ err: { message: 'MongoError' } })
          );

          deviceFindStub.restore();
          logWarnStub.reset();
          return done();
        });
      });
    });
    it('should log a warning and return null if no devices provide the service', function (done) {
      Device.collection.remove({});
      require('../')({}, imports, (error, returns) => {
        const ups = returns.ups;
        ups.init((initErr) => {
          assert.isNull(initErr);
          assert.calledOnce(logWarnStub);
          assert.calledWith(logWarnStub,
            sinon.match({ err: { message: 'Нет зарегистрированных устройств' } })
          );

          logWarnStub.reset();
          return done();
        });
      });
    });
    it('should skip already registered device and return null', function (done) {
      require('../')({}, imports, (error, returns) => {
        const ups = returns.ups;
        ups.connections[stubs.devices[0]._id] = {};
        ups.init((initErr) => {
          assert.isNull(initErr);
          return done();
        });
      });
    });
    it('should init', function (done) {
      require('../')({}, imports, (error, returns) => {
        const ups = returns.ups;
        ups.init((initErr) => {
          assert.isNull(initErr);
          assert.isOk(ups.connections[stubs.devices[0]._id]);
          return done();
        });
      });
    });
  });

  describe('#update()', function () {
    let ups;
    beforeEach(function (done) {
      Device.collection.insert(
        stubs.devices[0],
        () => {
          require('../')({}, imports, (registerErr, registerRes) => {
            ups = registerRes.ups;
            ups.init(() => done());
          });
        }
      );
    });
    afterEach(function (done) {
      Device.collection.remove(
        {},
        () => done()
      );
    });

    it('should log a warning if unable to connect to device', function (done) {
      ups.connections[stubs.devices[0]._id]._host = '127.0.0.1';
      ups.update();
      setTimeout(function () {
        assert.calledOnce(logWarnStub);
        logWarnStub.reset();
        return done();
      }, 25);
    });

    it('should emit an event if power goes offline', function (done) {
      sinon.stub(ups.connections[stubs.devices[0]._id], 'GetUPSVars')
        .yields({ 'ups.status': 'OB', 'battery.charge': 100 });
      imports.bus.on('ups:powerOffline', function () {
        assert.equal(ups.onbattery.indexOf(stubs.devices[0]._id) >= 0, true);
      });
      ups.update();
      setTimeout(function () {
        return done();
      }, 25);
    });

    it('should wait if battery is charged yet ', function (done) {
      ups.onbattery.push(stubs.devices[0]._id);
      sinon.stub(ups.connections[stubs.devices[0]._id], 'GetUPSVars')
        .yields({ 'ups.status': 'OB', 'battery.charge': 25 });
      ups.update();
      setTimeout(function () {
        assert.equal(ups.onbattery.indexOf(stubs.devices[0]._id) >= 0, true);
        return done();
      }, 25);
    });

    it('should emit an event if will shutdown', function (done) {
      ups.onbattery.push(stubs.devices[0]._id);
      sinon.stub(ups.connections[stubs.devices[0]._id], 'GetUPSVars')
        .yields({ 'ups.status': 'OB', 'battery.charge': 15 });
      imports.bus.on('ups:powerOffline', function () {
        assert.equal(ups.onbattery.indexOf(stubs.devices[0]._id) >= 0, true);
      });
      ups.update();
      setTimeout(function () {
        return done();
      }, 25);
    });

    it('should emit an event if power goes online', function (done) {
      ups.onbattery.push(stubs.devices[0]._id);
      sinon.stub(ups.connections[stubs.devices[0]._id], 'GetUPSVars')
        .yields({ 'ups.status': 'OL', 'battery.charge': 15 });
      imports.bus.on('ups:powerOnline', function () {
        assert.deepEqual(ups.onbattery, []);
      });
      ups.update();
      setTimeout(function () {
        return done();
      }, 25);
    });

    it('should update', function (done) {
      ups.update();
      setTimeout(function () {
        return done();
      }, 25);
    });
  });
});
