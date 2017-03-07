import angular from 'angular';
import uiRouter from 'angular-ui-router';
import moment from 'moment';
import routing from './read.routes';

export class ReadController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope, $filter, $state) {
    this.$http = $http;
    this.socket = socket;
    this.$filter = $filter;
    this.$state = $state;
    this.lofts = [];
  }

  $onInit() {
    this.item = Office.context.mailbox.item;
    this.getUser();
  }

  getUser() {
    if (this.item.sender !== undefined && this.item.sender.emailAddress) {
      this.$http.get('/api/users/', {}).then((data) => {
        let user = this.$filter('filter')(data.data, {
          email: this.item.sender.emailAddress
        });
        if (user.length) {
          this.user = user[0];
          this.user.created = moment(this.user.createdAt).toNow();
          this.getLofts();
        } else {
          this.$state.go('user');
        }

      }, function () {
      });
    }
  }

  getLofts() {

    this.$http({
      url: '/api/pixel/show',
      method: "GET",
      params: {
        email: this.item.sender.emailAddress
      }
    }).then(response => {
        this.lofts = response.data.pxl;
    });
  }
}

export default angular.module('angularStartApp.read', [uiRouter])
  .config(routing)
  .component('read', {
    template: require('./read.pug'),
    controller: ReadController,
    controllerAs: 'vm'
  })
  .name;
