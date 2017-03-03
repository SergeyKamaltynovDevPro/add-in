import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './write.routes';

export class WriteController {


  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope) {
    this.$http = $http;
    // this.socket = socket;
    // console.info('write');
    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('thing');
    // });
  }

  $onInit() {
    // this.$http.get('/api/things')
    //   .then(response => {
    //     this.awesomeThings = response.data;
    //     this.socket.syncUpdates('thing', this.awesomeThings);
    //   });
  }


}

export default angular.module('angularStartApp.write', [uiRouter])
  .config(routing)
  .component('write', {
    template: require('./write.pug'),
    controller: WriteController
  })
  .name;
