angular.module('tidbitsApp')
  .controller('AdminLeaderboardCtrl', function ($scope, $http) {

    $http.get('/api/users/adminLeaders/').then(function (res) {
      $scope.users = res.data;
    });

  });
