
const path = require('path');
const express = require('express');
// const webpack = require('webpack');

// module.exports = function setup(options, imports, register) {
//   const log = imports.log();
//   const config = imports.config();
  const app = express();

  app.use('/static', express.static(path.resolve(__dirname, 'public')));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'src', 'index.html'));
  });

  app.listen(3000, () => {
    // log.info(`Web application started and listening on port ${config.port}`);
  });

//   register(null, { webapp: app });
// };
