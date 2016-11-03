'use strict';

var glob = require('glob');

module.exports.init = (app) => {
  glob('/**/index.js', {root: __dirname}, (err, files) => {
    if (!err) {
      files.forEach((file) => {
        app.use(require(file));
      })
    }
  });
};

