'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('user', {
    url: '/read/user/',
    template: '<user></user>',
  });
}
