/**
 * Main application file
 */

'use strict';

import express from 'express';
import config from './config/environment';
import https from 'https';
import seedDatabaseIfNeeded from './config/seed';
import certConf from './cert/certconf';

// Setup server
var app = express();
var server = https.createServer(certConf, app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
app.use(function(req, res, next){
  res.io = socketio;
  next();
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

seedDatabaseIfNeeded();
setImmediate(startServer);

// Expose app
exports = module.exports = app;
