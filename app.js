'use strict';

var express = require('express'),
  stat = require('serve-static'),
  bodyParser = require('body-parser'),
  config = require('./config.json'),
  modules = require('./modules/modules');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(stat(__dirname + '/public'));
app.set('/views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index.html');
});

modules.init(app);

app.listen(config.app.port, () => {
  console.log(`Application started, please open http://localhost:${config.app.port}`);
});

