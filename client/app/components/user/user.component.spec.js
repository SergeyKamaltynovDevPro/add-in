'use strict';

describe('Component: user', function() {
  // load the component's module
  beforeEach(module('angularStartApp.user'));

  var userComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    userComponent = $componentController('user', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
