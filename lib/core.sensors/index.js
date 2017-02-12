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
   * #sensors()
   * @param {String}  id          Either sensor serial number or UUID..
   * @param {Object}  opts        Provides additional query configuration.
   * @param {Boolean} opts.plain  Should the returned object be a plain object?
   *
   * @callback cb
   */
  SensorManager.prototype.sensors = function sensors(id, opts, cb) {
    const plain = opts && Object.prototype.hasOwnProperty.call(opts, 'plain') && opts.plain;

    if (id) {
      Sensor.findOne({ $or: [{ _id: id }, { serial: id }] }).select('-__v').lean(!!plain)
        .exec(done);
    } else {
      Sensor.find({}).select('-__v').lean(!!plain)
        .exec(done);
    }

    function done(sensorFindErr, sensorFindRes) {
      if (sensorFindErr) {
        return cb(sensorFindErr);
      }

      return cb(null, sensorFindRes);
    }
  };

  /**
   * #readings()
   * @param {Object}  opts
   * @param {Boolean} opts.plain   Should the returned object be a plain object?
   * @param {String}  opts.period  Number of days to include in result. 1 = Today, 7 = Week, etc.
   * @param {String}  opts.sensor
   * @param {Date}    opts.timestamp
   *
   * @callback cb
   */
  SensorManager.prototype.readings = function readings(opts, cb) {
    const plain = opts && Object.prototype.hasOwnProperty.call(opts, 'plain');
    const period = opts && Object.prototype.hasOwnProperty.call(opts, 'period');
    const sensor = opts && Object.prototype.hasOwnProperty.call(opts, 'sensor');
    const timestamp = opts && Object.prototype.hasOwnProperty.call(opts, 'timestamp');

    if (timestamp) {
      // Normalize timestamp
      timestamp.setSeconds(0);
      Reading.findOne({ timestamp: { $eq: timestamp } });
    } else {

    }
    function done(readingFindErr, readingFindRes) {
      if (readingFindErr) {
        return cb(readingFindErr);
      }

      return cb(null, readingFindRes);
    };
  };

  /**
   * #addSensor()
   */
  SensorManager.prototype.addSensor = function addSensor(data, cb) {

  };

  /**
   * #addReading()
   */
  SensorManager.prototype.addReading = function addReading(data, cb) {

  };

  /**
   * #processRawData()
   * @param {Object} data
   * @param {String} data.device
   * @param {String} data.sensor
   * @param {Object} data.values
   * @callback cb
   */
  SensorManager.prototype.processRawData = function processRawData(data, cb) {
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
        for (let i = 0; i < Object.keys(data.values).length; i += 1) {
          if (sensor.values.indexOf(Object.keys(data.values)[i]) === -1) {
            sensor.values.push(Object.keys(data.values)[i]);
          }
        }
      }

      return sensor.save((sensorSaveErr) => {
        if (sensorSaveErr) {
          return cb(sensorSaveErr);
        }

        return this.readings(null, processReading);
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

      for (let i = 0; i < Object.keys(data.values).length; i += 1) {
        const value = {};
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

    return this.sensors(data.sensor, {}, processSensor.bind(this));
  };

  register(null, { sensors: new SensorManager() });
};
