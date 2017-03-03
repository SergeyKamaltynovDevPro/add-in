'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('templates', {
    url: '/write/templates/',
    template: '<templates></templates>',
  });
}
