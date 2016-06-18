'use strict';

module.exports = function setup(options, imports, register) {

  // core.playground - компонент, представляющий собой песочницу для тестирования взаимодействия
  // установленных и зарегистрированных компонентов.

  const log = imports.log('core.playground');
  const db = imports.db;
  const Device = db.model('core:device');
  const Sensor = db.model('core:sensor');

  // let device = new Device();
  // device._id = '99c17f59-5b6a-4541-a2f7-59f353168c93';
  // device.mac = 'b8:27:eb:0e:d4:32';
  // device.name = 'Maedhros';
  // device.address = '10.29.0.10';
  // device.hostname = 'maedhros.briskhome.com';
  // device.description = 'Сервер системы BRISKHOME';
  // device.location = {
  //   home: 'default',
  //   zone: 'indoors',
  //   room: 'garage',
  // };
  // device.services = ['onewire'];
  // device.save(function (err, data) {
  //   console.log(err, data);
  // });
  // const bus = imports.bus;
  // const sysinfo = imports.sysinfo;
  // const config = imports.config;
  // const api = imports.api;
  // const sms = imports.sms;
  // const onewire = imports.onewire;

  // sms.send('79207698585', 'Электропитание восстановлено.');

  // const irrigation = imports.irrigation;

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
