'use strict';

angular.module('tidbitsApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: true,
        access: { 'allow': 'admin' }
      });
  });
