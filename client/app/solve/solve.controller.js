'use strict';

angular.module('tidbitsApp')
  .controller('SolveCtrl', function ($scope, $http) {
  	$scope.refresh=function() {
	  	$http.get('/api/users/me').then(function(res) {
	  		console.log(res.data);
	  		$scope.solvedQuestions=res.data.solved;
	  		$http.get('/api/questions/next').then(function(res) {
	  		  console.log(res);
	  		  if(res.data=="") {
	  		  	$(".nq").hide();
	  		  	$(".nnq").show();
	  		  } else {
	  		    $scope.nextQuestion=res.data.question;
	  		    $scope.nextQuestionID=res.data._id;
	  		  }
	  		});
	  	});
	};
	$scope.refresh();
  	$scope.subAns=function() {
  	  $http.post('/api/answers/'+$scope.nextQuestionID, {
  	  	answer: $scope.answer
  	  }).then(function(res) {
  	  	if(res.status==200) {
  	  		$scope.refresh();
  	  	    $scope.correct="Correct answer!";
  	  	    $scope.wrong="";
  	  	    $scope.answer="";
  	  	}
  	  	else {
  	  	  $scope.wrong="Wrong answer!";
  	  	  $scope.correct="";
  	  	}
  	  });
  	};
  });
