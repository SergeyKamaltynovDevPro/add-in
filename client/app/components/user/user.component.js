'use strict';
const angular = require('angular');

export class userComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'World';
  }
}

export default angular.module('angularStartApp.user', [])
  .component('user', {
    template: '<h1>Hello {{ $ctrl.message }}</h1>',
    bindings: { message: '<' },
    controller: userComponent
  })
  .name;
