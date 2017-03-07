import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './user.routes';

export class userController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope, $timeout, ngToast, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$timeout= $timeout;
    this.ngToast= ngToast;
    this.ngToast= ngToast;

  }
  createUser(){
    let dataObj = {
      email : this.email,
      name : this.name,
      createdAt: new Date().getTime(),
      createdBy: {
        email: this.userProfile.emailAddress,
        name: this.userProfile.displayName
      }

    };
    this.$http.post('/api/users/', dataObj, {}).then(function(data){
      this.$state.go('read')
    }, function(){});
  }

  $onInit() {
    this.email = Office.context.mailbox.item.sender.emailAddress;
    this.name = Office.context.mailbox.item.sender.displayName;
    this.userProfile = Office.context.mailbox.userProfile;
  }
  successCallback(data){
    this.ngToast.create('user created');
  }
  errorCallback(){

  }

}

export default angular.module('angularStartApp.user', [uiRouter])
  .config(routing)
  .component('user', {
    template: require('./user.pug'),
    controller: userController,
    controllerAs: 'vm'
  })
  .name;
