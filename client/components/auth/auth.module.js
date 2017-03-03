'use strict';

import angular from 'angular';
import constants from '../../app/app.constants';
import util from '../util/util.module';
import ngCookies from 'angular-cookies';
import {AuthService} from './auth.service';
import {
  authInterceptor
} from './interceptor.service';


import uiRouter from 'angular-ui-router';

function addInterceptor($httpProvider) {
  'ngInject';
  $httpProvider.interceptors.push('authInterceptor');
}

export default angular.module('angularStartApp.auth', [constants, util, ngCookies, uiRouter])
  .factory('authInterceptor', authInterceptor)
  .service('Auth', AuthService)
  .config(['$httpProvider', addInterceptor])
  .name;
