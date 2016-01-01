'use strict';

angular.module('tidbitsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function($rootScope, $q, $cookies, $location) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get('tidbitsToken')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('tidbitsToken');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookies.remove('tidbitsToken');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and the user is not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (next.authenticate) {
        Auth.isLoggedIn(function (loggedIn) {
          if(!loggedIn) {
            event.preventDefault();
            $location.path('/login');
          }
          if(next.access) {
            var permissions = next.access;
            var userRole = Auth.getCurrentUser().role;
            if(permissions.except) {
              if(permissions.except.indexOf(userRole) > -1) {
                $location.url('/');
              }
            } else if(permissions.allow) {
              if(permissions.allow.indexOf(userRole) < 0) {
                $location.url('/');
              }
            }
          }        
        });
      }
    });
    
  });
