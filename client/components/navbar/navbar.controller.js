'use strict';

angular.module('tidbitsApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Solve Questions',
      'link': '/solve'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
