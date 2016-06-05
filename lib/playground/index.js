'use strict';

module.exports = function setup(options, imports, register) {

  const log = imports.log('core.playground');
  // const bus = imports.bus;
  // const sysinfo = imports.sysinfo;
  // const config = imports.config;
  // const api = imports.api;
  // const sms = imports.sms;
  // const onewire = imports.onewire;

  // sms.send('79207698585', 'Электропитание восстановлено.');

  const irrigation = imports.irrigation;

  log.info('Инициализация песочницы');
  // var y = setTimeout(function () {
  //   irrigation.start('greenhouse', { period: 20 }, function (err, circuit) {
  //     console.log(err, circuit);
  //   });
  // }, 5000);

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


  // var c1 = new imports.db.models.Circuit();
  // c1.name = 'tank';
  // c1.sensors = {};
  // c1.sensors.distance = 200;
  // c1.save();
  //
  // var c2 = new imports.db.models.Circuit();
  // c2.name = 'garden';
  // c2.sensors = {};
  // c2.sensors.moisture = 400;
  // c2.save();
  //
  // var c3 = new imports.db.models.Circuit();
  // c3.name = 'greenhouse';
  // c3.sensors = {};
  // c3.sensors.moisture = 200;
  // c3.sensors.temperature = 0;
  // c3.sensors.humidity = 67;
  // c3.save();

  register(null, {
    playground: this,
  });

};
