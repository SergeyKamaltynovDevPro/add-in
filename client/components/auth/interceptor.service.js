'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util, Auth) {
  'ngInject';

  var state;
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      var user = Auth.getUser();
      if(user && user.accessToken && !Util.isSameOrigin(config.url)) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if(response.status === 401) {
        this.auth();
      }
      return $q.reject(response);
    }
  };
}
