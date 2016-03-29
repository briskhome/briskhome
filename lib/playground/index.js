'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const bus = imports.bus;
  const sysinfo = imports.sysinfo;
  const config = imports.config;

  log.info(config.test);

  log.info('sysinfo', sysinfo);

  sysinfo.start();
  bus.on('event', function(event) {
    log.info(event, 'briskhome-sysmon:');
    console.log(event);
  });
};
