/**
 * @briskhome/core.sensors <lib/core.sensors/index.js>
 *
 * Sensor Manager API.
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

module.exports = function setup(options, imports, register) {
  const db = imports.db;
  const Sensor = db.model('core:sensor');
  const Reading = db.model('core:reading');

  // sensorWithSerial();
  // findOne
  // find
  // save
  // lastValue
  // values('1w, 1d, 10h') / values(24)

  /**
   *
   */
  function SensorManager() {

  }

  /**
   * #findSensor()
   * @param {String} id  Serial number of a sensor.
   * @callback cb
   */
  SensorManager.prototype.findSensor = function findOne(id, data, cb) {
    Sensor.findOne({ _id: id }, (sensorFindErr, sensorFindRes) => {
      if (sensorFindErr) {
        return cb(sensorFindErr);
      }

      return cb(null, sensorFindRes);
    });
  };

  /**
   * #findReading()
   * @callback cb
   */
  SensorManager.prototype.findReading = function findReading(cb) {
    Reading.findOne({ timestamp: { $eq: Date('31-08-2016 00:00') } }, (readingFindErr, readingFindRes) => {
      if (readingFindErr) {
        return cb(readingFindErr);
      }

      return cb(null, readingFindRes);
    });
  };

  /**
   * #addReading()
   * @param {Object} data
   * @param {String} data.device
   * @param {String} data.sensor
   * @param {Object} data.values
   * @callback cb
   */
  SensorManager.prototype.addReading = function addReading(data, cb) {
    function processSensor(sensorFindErr, sensorFindRes) {
      if (sensorFindErr) {
        return cb(sensorFindErr);
      }

      let sensor;
      if (!sensorFindRes) {
        sensor = new Sensor();
        sensor._id = data.sensor;
        sensor.device = data.device;
        sensor.values.push(Object.keys(data.values));
      } else {
        sensor = sensorFindRes;
        for (let i; i < Object.keys(data.values); i += 1) {
          if (sensor.values.indexOf(Object.keys(data.values)[i]) === -1) {
            sensor.values.push(Object.keys(data.values)[i]);
          }
        }
      }

      return sensor.save((sensorSaveErr) => {
        if (sensorSaveErr) {
          return cb(sensorSaveErr);
        }

        return this.findReading(null, processReading);
      });
    }

    function processReading(readingFindErr, readingFindRes) {
      if (readingFindErr) {
        return cb(readingFindErr);
      }

      let reading;
      if (!readingFindRes) {
        reading = new Reading();
        // WARNING: LOCAL TIME
        reading.timestamp = new Date().setUTCHours(0, 0, 0, 0);
        reading.values = [];
      } else {
        reading = readingFindRes;
      }

      for (let i; i < Object.keys(data.values); i += 1) {
        let value;
        value[Object.keys(data.values)[i]] = data.values[Object.keys(data.values)[i]];
        reading.values.push(value);
      }

      return reading.save((readingSaveErr) => {
        if (readingSaveErr) {
          return cb(readingSaveErr);
        }

        return cb(null);
      });
    }

    return this.findSensor(data.sensor, processSensor);
  };

  register(null, { sensors: new SensorManager() });
};
