'use strict';

angular.module('tidbitsApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/scoreboard', {
        templateUrl: 'app/scoreboard/scoreboard.html',
        controller: 'ScoreboardController',
        controllerAs: 'Scoreboard'
      });
  });
