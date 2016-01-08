angular.module('tidbitsApp')
  .controller('AdminLeaderboardCtrl', function ($scope, $http, ExcelDownloader, $timeout) {

  	$scope.totalRegistrations = 0;
    $http.get('/api/users/adminLeaders/').then(function (res) {
      $scope.totalRegistrations = res.data.length;
      $scope.users = res.data;
    });

    $scope.toggleQualification = function (userId, index) {
      $http.put('/api/users/toggleQualification/' + userId)
        .then(function (response) {
          if(response.status == 204) {
            $scope.users[index].disqualified = !$scope.users[index].disqualified;
          }
        });
    };

    $scope.exportToExcel = function (tableId) {
      $scope.exportHref = ExcelDownloader.tableToExcel(tableId, 'sheet name');
      $timeout(function () {
        var link = document.createElement('a');
        link.download = "Tidbits2016-AdminLeaderboard.xlsx";
        link.href = $scope.exportHref;
        link.click();
      }, 100);
    };

  });
