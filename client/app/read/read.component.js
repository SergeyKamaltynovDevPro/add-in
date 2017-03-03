import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './read.routes';

export class ReadController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope) {
    this.$http = $http;
    this.socket = socket;
    console.info('testREad');
    window.open('https://localhost:3000/connect/azure/'+ $scope.sessionID, 'AuthPopup', 'width=500,height=500,centerscreen=1,menubar=0,toolbar=0,location=0,personalbar=0,status=0,titlebar=0,dialog=1');
    socket.on('auth_success', function onAuthSuccess(authenticationData) {
      console.info('success',authenticationData);
      // self.onAuthSuccess(authenticationData);
      // self.sendReminder(authenticationData);
      // self.showNotification('Remider created', 3000);
    });
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    // this.$http.get('/api/things')
    //   .then(response => {
    //     this.awesomeThings = response.data;
    //     this.socket.syncUpdates('thing', this.awesomeThings);
    //   });
  }


}

export default angular.module('angularStartApp.read', [uiRouter])
  .config(routing)
  .component('read', {
    template: require('./read.pug'),
    controller: ReadController
  })
  .name;
