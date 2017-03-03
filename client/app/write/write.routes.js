'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main.write', {
    url: '/write',
    template: '<write></write>',
  });
}
