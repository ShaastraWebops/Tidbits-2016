'use strict';
(function() {

function MainController($scope, $http, Auth) {
  $http.get('/api/users/leaders/').then(function (res) {
  	$scope.users=res.data;
  });

  $scope.currUser = Auth.getCurrentUser();
  $http.get('/api/users/currUserPosition/').then(function (res) {
    console.log(res);
    $scope.currUserPosition = res.data;
  });
}

angular.module('tidbitsApp')
  .controller('MainController', MainController);

})();
