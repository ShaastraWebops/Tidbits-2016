angular.module('tidbitsApp')
  .controller('AdminCtrl', function ($scope, $http) {

    var converter = new showdown.Converter();
    $scope.xmark = function (b) {
      return converter.makeHtml(b);
    };

  	$scope.reload = function () {
  	  $http.get('/api/questions')
        .then(function (res) {
  	     $scope.questions = res.data;
  	   });
  	};

  	$scope.reload();

  	var hasChanged = "There are unsaved changes. Please click the 'Save' button to save them before proceeding.";
  	$scope.savedText = "";
  	$scope.thereChange = "";
  	$scope.newQQ = ""; 
    $scope.newQA = "";
    $scope.newQH = "";
  	$scope.newQuestion = function (form) {
  	  if(form.$valid) {
  	    $http.post('/api/questions/', {
  	      question: $scope.newQQ,
  	      answer: $scope.newQA,
          hints: $scope.newQH
  	    }).then(function (res) {
  	      $scope.qCreated = " Question added!";
  	      $scope.newQA = "";
  	      $scope.newQQ = "";
          $scope.newQH = "";
  	      $scope.reload();
  	    });
	   }
  	};

    $scope.toggleHints = function (question) {
      var value = question.displayHints;
      $http.put('/api/questions/' + question._id, {
        displayHints: value
      }).then(function (response) {
        $scope.reload();
      });
    };

  	$scope.edit = function (id) {
  	  for(var i=0; i<$scope.questions.length; i++) {
  	    var question = $scope.questions[i];
  	  	if(question._id==id) {
	  	    $(".ne_" + question._id).hide();
	  	    $(".ye_" + question._id).show();
	  	    $(".ne").hide();
	  	    question.newQ = question.question;
	  	    question.newA = question.answer;
          question.newH = question.hints;
  	  	  break;
  	  	}
  	  }
  	};

  	$scope.save = function(id) {
  	  for(var i=0; i<$scope.questions.length; i++) {
  	    var question=$scope.questions[i];
  	  	if(question._id==id) {
  	  	  $http.put('/api/questions/' + id, {
  	  	  	question: question.newQ,
  	  	  	answer: question.newA,
            hints: question.newH
  	  	  }).then(function (res) {
  	  	    $(".ne_" + question._id).show();
  	  	    $(".ye_" + question._id).hide();
  	  	    $(".ne").show();
            $scope.reload();
  	  	  });
  	  	}
  	  }
  	};

  	$scope.cancel = function (id) {
  	  for(var i=0; i<$scope.questions.length; i++) {
  	    var question = $scope.questions[i];
  	  	if(question._id == id) {
  	  	  question.newQ = question.question;
  	  	  question.newA = question.answer;
          question.newH = question.hints;
  	      $(".ne_" + question._id).show();
  	      $(".ye_" + question._id).hide();
  	      $(".ne").show();
	  	  }
	    }
  	};

  	$scope.delete = function (id) {
  	  if(confirm("Are you sure you want to delete that question?")) {
  	  	$http.delete('/api/questions/' + id).then(function (res) {
  	  	  $scope.reload();
  	    });
      }
  	};

  });
