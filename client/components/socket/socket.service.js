'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';

function Socket(socketFactory, Auth) {
  'ngInject';
  // socket.io now auto-configures its connection when we ommit a connection url

  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });
  var socket = socketFactory({
    ioSocket
  });
  ioSocket.on('connect', function () {
    ioSocket.emit('getUser', '', function (data) {
      console.info(data);
      Auth.setUser(data.data.providers[0]);
    });
    ioSocket.on('auth_success', (data) =>{
      console.info(data);
      Auth.setUser(data);
    });
  });

  return ioSocket;
}

export default angular.module('angularStartApp.socket', [])
  .factory('socket', Socket)
  .name;
