'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('read', {
    url: '/read/',
    template: '<read></read>',
  });
}
