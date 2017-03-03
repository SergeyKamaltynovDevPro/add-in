'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';
import 'ng-office-ui-fabric';
import 'jquery';
import 'ng-toast';
import uiRouter from 'angular-ui-router';
import _Auth from '../components/auth/auth.module';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';
import {
  routeConfig
} from './app.config';

import main from './main/main.component';

import write from './write/write.component';
import templates from './write/templates/templates.component';

import read from './read/read.component';
import reminder from './read/reminder/reminder.component'


import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import './app.scss';

import '!style!css!office-ui-fabric/dist/css/fabric.components.css';
import '!style!css!office-ui-fabric/dist/css/fabric.min.css';
import '!style!css!ng-toast/dist/ngToast.css';
import '!style!css!ng-toast/dist/ngToast-animations.css';
import './app.scss';
angular.module('angularStartApp', [_Auth,ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter,
   main, write, read, reminder, templates, constants, socket, util, 'officeuifabric.core',
  'officeuifabric.components', 'ngToast', 'ngAnimate'
])
  .config(routeConfig)

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['angularStartApp'], {
      strictDi: true
    });
  });
