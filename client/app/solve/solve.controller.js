'use strict';

angular.module('tidbitsApp')
  .controller('SolveCtrl', function ($scope, $http) {

    var converter = new showdown.Converter();
    $scope.xmark = function (b) {
      return converter.makeHtml(b);
    };

  	$scope.refresh = function () {
	  	$http.get('/api/users/me').then(function (res) {
        $scope.disqualified = res.data.disqualified;
	  		$scope.solvedQuestions = res.data.solved;
	  		$http.get('/api/questions/next/').then(function (res) {
	  		  if(res.data == "") {
	  		  	$(".nq").hide();
	  		  	$(".nnq").show();
	  		  } else {
	  		    $scope.nextQuestion = res.data.question;
            $scope.nextQuestionHints = res.data.hints;
            $scope.nextQuestionDisplayHints = res.data.displayHints;
	  		    $scope.nextQuestionID = res.data._id;
	  		  }
	  		});
	  	});
	  };
	
    $scope.refresh();
    
  	$scope.subAns = function() {
  	  $http.post('/api/answers/' + $scope.nextQuestionID, { answer: $scope.answer })
        .then(function (res) {
    	  	if(res.status == 200) {
    	  		$scope.refresh();
  	  	    $scope.correct = "Correct answer!";
  	  	    $scope.wrong = "";
  	  	    $scope.answer = "";
    	  	}
    	  	else {
    	  	  $scope.wrong = "Wrong answer!";
    	  	  $scope.correct = "";
    	  	}
    	  });
  	};

    $scope.showHintsCheck = false;
    $scope.showHints = function() {
      $scope.showHintsCheck = true;
    };
  
  });
