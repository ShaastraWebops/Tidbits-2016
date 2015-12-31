'use strict';

angular.module('tidbitsApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/adminLeaderboard', {
        templateUrl: 'app/adminLeaderboard/adminLeaderboard.html',
        controller: 'AdminLeaderboardCtrl',
        authenticate: true,
        access: { 'allow': 'admin' }
      });
  });
