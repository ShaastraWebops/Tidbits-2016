'use strict';

angular.module('tidbitsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/solve', {
        templateUrl: 'app/solve/solve.html',
        controller: 'SolveCtrl',
        authenticate: true
      });
  });
