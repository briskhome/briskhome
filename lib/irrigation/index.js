/**
* @briskhome/irrigation <lib/irrigation/index.js>
*
* Greenhouse watering and climate control module.
*
* @author Egor Zaitsev <ezaitsev@briskhome.com>
* @version 0.1.2
*/

// TODO v1.0.0
//  [ ] Data encryption. Currently all data is sent via UDP unencrypted ergo
//      anyone can plug into our network and send irrigation commands directly
//      to the controller.
//  [ ] Unit tests.
//  [ ] Add check for disabled circuit.

// TODO v0.1.2
//  [ ] Logic for incoming messages.
//  [x] Improved logic for irrigation timeouts and intervals.
//  [ ] Move logger declaration out of @constructor.
//  [ ] Include companion Arduino Sketch.

'use strict';

module.exports = function setup(options, imports, register){

  const arc4 = require('arc4');
  const dgram = require('dgram');

  const db = imports.db;
  const log = imports.log;
  const config = imports.config;

  const Schema = db.Schema;
  const CircuitSchema = new Schema({
    name: { type: String, required: true, unique: true },
    pin: { type: Number, required: true, unique: true },
    flow: { type: Number, max: 10, default: 10 },
    humidity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
  }, {
    collection: 'irrigation.circuits'
  });
  const RequestSchema = new Schema({
    body: { type: String, required: true, unique: true },
    timestamp: { type : Date, default: Date.now }
  }, {
    collection: 'irrigation.requests'
  });
  const Circuit = db.model('Circuit', CircuitSchema);
  const Request = db.model('Request', RequestSchema);

  /**
   * The Controller class ...
   *
   * @constructor
   */
  function Controller() {

    // Adding log target that will collect all log messages from irrigation
    // controller so that main logfile stays brief and up to the point.
    // Also dumping the current irrigation configuration to the trace log.

    log.addTarget('file', { file: 'log/irrigation.log' })
      .withFormatter('commonInfoModel')
      .onlyIncluding({ file: /irrigation/ })
      .excluding({ message: /Initializing/ });
    log.trace('Irrigation controller configuration', config.irrigation);

    const _this = this;

    if (config.irrigation.controller.mode === 'udp') {
      this.cipher = arc4('arc4', config.irrigation.controller.secret);
      this.socket = dgram.createSocket('udp4');
      this.socket.on('listening', function() {
        let address = this.address();
        log.info('Initializing irrigation controller', {
          address: address.address,
          port: address.port,
          mode: config.irrigation.controller.mode,
        });

        _this.updater = setInterval(function() {
          _this.status();
        }.bind(this), config.irrigation.interval * 1000);

        _this.circuits(null, function(err, data){
          if (err) {
            log.error(err);
          }
          for (let i = 0; i < data.length; i++) {
            if (data[i].isActive) {
              log.warn('Active circuit has been detected at startup, stopping', {
                circuit: data[i].name,
              });
              log.trace(data[i]);
              _this.stop(data[i]);
            }
          }
        });
      });
      this.socket.on('message', function (message, remote) {
        if (remote.address === '127.0.0.1') {
          let req = new Request();
          req.body = message.toString();
          req.save();
          return;
        } else {
          log.info('Received ' + message.length + ' bytes from remote host.', {
            event: 'message',
            address: remote.address,
            port: remote.port,
            message: message.toString(),
          });
          // this.decode(message, remote);
        }
      });
      this.socket.on('error', function (err) {
        log.error(err);
      });
      this.socket.bind(
        config.irrigation.controller.port,
        config.irrigation.controller.address
      );
    }
    this.active = {};

    require('./routes')(this, imports);
  }

  /**
   * Starts watering a selected circuit.
   *
   * This method ...
   *
   * @param {string} circuit  Identifier of the circuit to be toggled.
   * @param {number} timeout  Amound of time the circuit should be open for.
   * @param {number} humidity Humidity value upon reaching which the watering
   *        should be stopped.
   * @callback callback
   */
  Controller.prototype.start = function start(circuit, desiredPeriod, desiredHumidity) {
    const _this = this;
    _this.circuits(circuit, function(err, data) {
      if (err || !data || 0 === data.length) {
        log.error('Possibly incorrect circuit identifier:', {
          circuit: circuit,
        }, err);
        return;
      }
      if (data[0].toObject().isActive) {
        log.error('Attempting to start an already active circuit!', {
          circuit: circuit.name,
          isActive: circuit.isActive
        });
        return;
      } else {
        if (config.irrigation.controller.mode === 'udp') {
          log.debug('Atttempting to start irrigation of a circuit', {
            circuit: circuit.name,
          });

          let req = {};
          req.timestamp = Math.floor((new Date()).getTime()/1000);
          req.id = '999';
          req.device = circuit.pin;
          req.action = '1';

          let messageString = '' + req.timestamp + req.id + req.device + req.action;
          // let encodedString = this.encode(messageString);
          let messageBuffer = new Buffer(messageString);

          _this.socket.send(messageBuffer, 0, messageBuffer.length, config.irrigation.controller.port, config.irrigation.controller.address, function(err) {
            if (err) {
              log.error(err);
            }
            // TODO Delay + status check.
            log.info('Started irrigation of the circuit', {
              circuit: circuit.name,
            });

            circuit.isActive = true;
            circuit.save();

            if (desiredHumidity) {
              log.debug('Beginning monitoring soil humidity', {
                circuit: circuit.name,
              });

              let overflow = Math.floor(config.irrigation.reservoir / circuit.flow);
              _this.active[circuit.name] = setInterval(function() {
                _this.circuits(circuit, function(err, data) {
                  log.trace('Monitoring soil humidity', {
                    circuit: circuit.name,
                    current: data[0].toObject().humidity,
                    desired: desiredHumidity,
                    diff: desiredHumidity - parseInt(data[0].toObject().humidity),
                    overflow: overflow,
                  });
                  let currentHumidity = parseInt(data[0].toObject().humidity);
                  if (currentHumidity >= desiredHumidity || !overflow) {
                    clearInterval(_this.active[circuit.name]);
                    _this.stop(circuit, function(err) {
                      if (err) {
                        log.error(err);
                      }
                    });
                  }
                  overflow--;
                });
              }, 6000);
            } else {
              log.debug('Beginning timed irrigation', {
                circuit: circuit.name,
                desiredPeriod: desiredPeriod ? desiredPeriod : 900000,
              });

              let period = desiredPeriod > 0 ? desiredPeriod : 900000;
              let overflow = Math.floor(config.irrigation.reservoir / circuit.flow);
              _this.active[circuit.name] = setTimeout(function() {
                _this.stop(circuit, function(err) {
                  if (err) {
                    log.error(err);
                  }
                });
              }, period);
            }
          });
        }
      }
    });
  };

  /**
   * Stops irrigation of a circuit.
   *
   * This method ...
   *
   * @param {Object} circuit
   */
  Controller.prototype.stop = function stop(circuit) {
    const _this = this;
    if (config.irrigation.controller.mode === 'udp') {
      _this.circuits(circuit, function(err, data) {
        if (!!data.isActive) {
          log.error('Attempting to stop an already dry circuit', {
            circuit: circuit.name,
            isActive: circuit.isActive,
          });
        } else {
          log.debug('Attempting to stop irrigation of a circuit', {
            circuit: circuit.name,
          });

          // TODO
          log.trace(data);
          data[0].isActive = false;
          data[0].save();

          let req = {};
          req.timestamp = Math.floor((new Date()).getTime()/1000);
          req.id = '999';
          req.device = circuit.pin;
          req.action = '0';
          let messageString = '' + req.timestamp + req.id + req.device + req.action;
          // let encodedString = this.encode(messageString);
          let messageBuffer = new Buffer(messageString);

          _this.socket.send(messageBuffer, 0, messageBuffer.length, config.irrigation.controller.port, config.irrigation.controller.address, function(err) {
            if (err) {
              log.error(err);
            }
            log.info('Stopped irrigation of a circuit', {
              circuit: circuit.name,
            });
          });
        }
      });
    }
  };

  /**
   * Posts a request for regular status information.
   *
   * This method ...
   *
   * @param {Object} circuit
   * @callback callback
   */
  Controller.prototype.status = function status() {
    const _this = this;
    if (config.irrigation.controller.mode === 'udp') {
      let req = {};
      req.timestamp = Math.floor((new Date()).getTime()/1000);
      req.id = '999';

      let messageString = '' + req.timestamp + req.id;
      // let encodedString = this.encode(messageString);
      let messageBuffer = new Buffer(messageString);

      _this.socket.send(messageBuffer, 0, messageBuffer.length, config.irrigation.controller.port, config.irrigation.controller.address, function(err) {
        if (err) {
          log.error(err);
        }
        log.debug('Sent a request for status update');
      });
    }
  };

  /**
   * Returns information about available circuits.
   *
   * This method ...
   *
   * @param {Object} circuit
   * @callback callback
   */
  Controller.prototype.circuits = function circuits(circuit, callback) {
    if (circuit) {
      Circuit.find({_id: circuit._id}, done);
    } else {
      Circuit.find({}, done);
    }
    function done(err, data) {
      if (err) callback(err);
      return callback(null, data);
    }
  };

  Controller.prototype.encode = function encode(message) {
    let encodedString = this.cipher.encodeString(message);
    return encodedString;
  };

  Controller.prototype.decode = function decode(message, remote) {
    let decodedString = this.cipher.decodeString(message);
    log.info('Decoded message ' + remote.address + ': ' + message);
    return decodedString;
  };

  register(null, {
    irrigation: new Controller(),
  });
};
