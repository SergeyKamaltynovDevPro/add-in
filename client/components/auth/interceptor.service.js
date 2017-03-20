'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util, Auth,socket) {
  'ngInject';

  var state;
  return {
    // Add authorization token to headers
    request(config) {
      if (Util.isSameOrigin(config.url)){
        return config;
      }
      config.headers = config.headers || {};
      let user = Auth.getUser();
      let deferred = $q.defer();
      if(user && user.accessToken){
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
      } else {
        Auth.auth();
        socket.on('auth_success', (data) =>{
          config.headers.Authorization = `Bearer ${data.accessToken}`;
          deferred.resolve(config);
        });
        return deferred.promise;
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if(response.status === 401) {
        Auth.auth();
      }
      return $q.reject(response);
    }
  };
}

