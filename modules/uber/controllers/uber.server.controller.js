'use strict';

var Uber = require('node-uber'),
  Geocoder = require('node-geocoder'),
  path = require('path'),
  _ = require('lodash'),
  config = require(path.resolve(__dirname, '../../../config'));

var uber = new Uber({
  client_id: config.uber.clientID,
  client_secret: config.uber.clientSecret,
  server_token: config.uber.serverToken,
  redirect_uri: `http://localhost:${config.app.port}/api/callback`,
  name: config.uber.appName,
  sandbox: true
});

var geocoder = Geocoder({
  provider: 'google',
  httpAdapter: 'https',
  apiKey: config.google.apiKey,
});

module.exports = {
  getUberData: (req, res) => {
    let start = req.body.start,
      end = req.body.end;
    if (!start || !end) {
      return res.send({error: 'Invalid request'});
    }
    else {
      geocoder.geocode(start, (errStart, startData) => {
        if (errStart) {
          return res.send({error: 'Error while getting start address: ' +  JSON.stringify(errStart)});
        }
        else if (!startData.length) {
          return res.send({error: 'Cannot locate start address, please check your request'});
        }
        else {
          geocoder.geocode(end, (errEnd, endData) => {
            if (errEnd) {
              return res.send({error: 'No such end address: ' +  JSON.stringify(errEnd)});
            }
            else if (!endData.length) {
              return res.send({error: 'Cannot locate end address, please check your request'});
            }
            else {
              let startLat = startData[0].latitude;
              let startLng = startData[0].longitude;
              let endLat = endData[0].latitude;
              let endLng = endData[0].longitude;
              uber.estimates.getPriceForRoute(startLat, startLng, endLat, endLng, (err, result) => {
                if (err) {
                  res.send({error: 'Error while getting uber data: ' + JSON.stringify(err)})
                }
                else {
                  let min = _.minBy(result.prices, (price) => {
                    return price.minimum;
                  });
                  if (min) {
                    let value = min.minimum * (1 - config.discount);
                    res.send({data: `After${min.display_name}, price: ${value} ${min.currency_code}`});
                  }
                  else {
                    res.send({error: 'No prices for your request'});
                  }
                }
              })
            }
          });
        }
      })
    }
  },
  auth: (req, res) => {
    var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
    console.log(url);
    res.redirect(url);
  },
  callback: (req, res) => {
    uber.authorization({
      authorization_code: req.query.code
    }, function(err) {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/');
      }
    });
  }
};