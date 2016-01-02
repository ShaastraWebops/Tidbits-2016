angular.module('tidbitsApp')
  .controller('AdminLeaderboardCtrl', function ($scope, $http) {

  	$scope.totalRegistrations = 0;
    $http.get('/api/users/adminLeaders/').then(function (res) {
      $scope.totalRegistrations = res.data.length;
      $scope.users = res.data;
    });

  });
