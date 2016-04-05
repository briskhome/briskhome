'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const bus = imports.bus;
  const sysinfo = imports.sysinfo;
  const config = imports.config;
  const api = imports.api;

  log.info(log);

  const irrigation = imports.irrigation;
  let x = setTimeout(function() {
    irrigation.circuits(null, function(err, data) {
      if (err) log.error (err);
      // irrigation.start('test');
      irrigation.start(data[1], null, 10);
      let x = setTimeout(function() {
        irrigation.start(data[0], null, 10);
      }, 15000);
    });
  }, 10000);


  // log.info('sysinfo', sysinfo);

  // sysinfo.start();
  // bus.on('event', function(event) {
  //   log.info(event, 'briskhome-sysmon:');
  //   console.log(event);
  // });
};
