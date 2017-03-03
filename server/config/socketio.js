/**
 * Socket.io configuration
 */
'use strict';
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
// import dbHelper from '../db/dbHelper';
var dbHelper = new(require('../db/dbHelper'))();
// import config from './environment';

// When the user disconnects.. perform this
function onDisconnect(/*socket*/) {}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('getUser', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  // Insert sockets below
 // require('../api/thing/thing.socket').register(socket);
}

export default function(socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function(socket) {
    socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;

    socket.connectedAt = new Date();


    var jsonCookie = cookie.parse(socket.handshake.headers.cookie);
    var sessionID = cookieParser.signedCookie(jsonCookie.nodecookie, 'keyboard cat');
    socket.join(sessionID);

    socket.log = function(...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    socket.on("getUser", function(name, fn) {
      dbHelper.getUserData(sessionID, function(error, userData){
        if(error){
          fn({data: null});
        }
        fn({data: userData});
      })

    });
    // socket.on("getUser", function(name, fn) {
    //   dbHelper.getUserData(sessionID, function(error, userData){
    //     if(error){
    //       fn({data: null});
    //     }
    //     fn({data: userData});
    //   })
    //
    // });
    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');

  });
}