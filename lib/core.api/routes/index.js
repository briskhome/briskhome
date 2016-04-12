'use strict';

const fs = require('fs');
const validFileTypes = ['js'];

const loadRoutes = function (directory, server, imports) {
  fs.readdirSync(directory).forEach(function (fileName) {
    // Recurse if directory
    if (fs.lstatSync(directory + '/' + fileName).isDirectory()) {
      loadRoutes(directory + '/' + fileName, server, imports);
    } else {
      if (fileName === 'index.js' && directory === __dirname) return;
      if (validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;
      require(directory + '/' + fileName)(server, imports);
      imports.log.debug('Загружены маршруты из файла ' + directory.split('/').pop() + '/' + fileName);
    }
  });
};

module.exports = function (server, imports) {
  loadRoutes(__dirname, server, imports);
};
