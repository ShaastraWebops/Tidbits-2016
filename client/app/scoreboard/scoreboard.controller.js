'use strict';
(function() {

function ScoreboardController($scope, $http, Auth) {
  $http.get('/api/users/leaders/').then(function (res) {
  	$scope.users=res.data;
  });

  $scope.loggedIn = false;
  Auth.isLoggedIn(function (loggedIn) {
  	if(loggedIn) {
  		$scope.loggedIn = true;
		  $scope.currUser = Auth.getCurrentUser();
		  $http.get('/api/users/currUserPosition/').then(function (res) {
		    $scope.currUserPosition = res.data;
		  });
  	}
  });

}

angular.module('tidbitsApp')
  .controller('ScoreboardController', ScoreboardController);

})();
