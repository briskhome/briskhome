'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log;
  const bus = imports.bus;
  const sysinfo = imports.sysinfo;
  const config = imports.config;
  const api = imports.api;
  const sms = imports.sms;
  const onewire = imports.onewire;

  // sms.send('79207698585', 'Электропитание восстановлено.');

  // const irrigation = imports.irrigation;
  // log.info('Инициализация песочницы');
  // var y = setTimeout(function() {
  //   irrigation.start('garden', { humidity: 60000 });
  // }, 6000);

  // var y = setTimeout(function() {
  //   // irrigation.circuits(function(err, data) {
  //   //   if (err) log.trace(err);
  //   // });
  //   //
  //   // irrigation.circuits('garden', function(err, data) {
  //   //   if (err) log.trace(err);
  //   // });
  //
  //   irrigation.start('testing123', { humidity: 60000 });
  //   let x = setTimeout(function() {
  //     irrigation.stop('greenhouse');
  //   }, 6000);
  // }, 6000);

  register(null, {
    playground: this,
  });

};
