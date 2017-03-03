
'use strict';
export function AuthService($rootScope) {
  'ngInject';
  this.user ='';

  this.auth = function () {
    window.open('https://localhost:3000/connect/azure/'+ $rootScope.sessionID, 'AuthPopup', 'width=500,height=500,centerscreen=1,menubar=0,toolbar=0,location=0,personalbar=0,status=0,titlebar=0,dialog=1');
  }
  this.getUser = function () {
    return this.user;
  }

  this.setUser = function (auth) {
    this.user = auth;
  }
}
