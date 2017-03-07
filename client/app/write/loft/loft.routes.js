'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('loft', {
    url: '/write/loft/',
    template: '<loft></loft>',
  });
}
