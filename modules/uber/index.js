'use strict';

var express = require('express');
var controller = require('./controllers/uber.server.controller');

var router = express.Router();

router.route('/api/uber')
  .post(controller.getUberData);

router.route('/api/login')
  .get(controller.auth);

router.route('/api/callback')
  .get(controller.callback);

module.exports = router;