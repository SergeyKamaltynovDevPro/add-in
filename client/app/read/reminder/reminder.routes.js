'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('reminder', {
    url: '/read/reminder/',
    template: '<reminder></reminder>',
  });
}
