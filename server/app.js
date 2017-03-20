/**
 * Main application file
 */

'use strict';

import express from 'express';
import config from './config/environment';
import https from 'https';
import seedDatabaseIfNeeded from './config/seed';
import certConf from './cert/certconf';
import PxlMongodb from 'pxl-mongodb';
let pxl = new PxlMongodb({
  collectionPxls: 'pxls', // Name of the collection to store pxl documents for access tracking
  collectionLinks: 'links', // Name of the collection to store shortened links
  alwaysShortenWithNewLinkId: false // Set to true if you need a different linkId each time you shorten a link - even if the link was shortened before

});
pxl.connect('mongodb://localhost:27017/test', {}) // Passed values are the defaults
  .then((collections) => {
      // collections.pxls.stats().then(function(stat){
      // })
    // collections.lists.stats().then(console.dir)
  });

// Setup server
var app = express();
var server = https.createServer(certConf, app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
app.use(function (req, res, next) {
  res.io = socketio;
  next();
});
app.use(function (req, res, next) {
  req._pxl = pxl;
  next();
});
app.use(pxl.trackPxl);
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

seedDatabaseIfNeeded();
setImmediate(startServer);

// Expose app
exports = module.exports = app;
