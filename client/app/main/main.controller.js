'use strict';
(function() {

function MainController($scope, $http) {
  /*$http.post('/api/questions/', {
    question: "How are you?",
    answer: "Fine"
  }).then(function(res) {
    console.log(res);
  });*/
  $http.get('/api/users/leaders/').then(function(res) {
  	$scope.users=res.data;
  });
}

angular.module('tidbitsApp')
  .controller('MainController', MainController);

})();
