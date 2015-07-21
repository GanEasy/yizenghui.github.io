var server_api = "https://yizen.sinaapp.com/";
var api_exe = "?token=111";
var app = angular.module('app', ['ngRoute','ngSanitize','restServices','ngFileUpload','ngAnimate','ajoslin.promise-tracker']);
app.config(function ($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'listController'

            //templateUrl: '/views/edit.html',
            //controller: 'EditCtrl'
        })
        .when('/list', {

            templateUrl: '/views/home.html',
            controller: 'listController'
            //templateUrl: '/views/list.html',
            //controller: 'listController'
        })
        .when('/edit', {
            templateUrl: '/views/edit.html',
            controller: 'EditCtrl'
        })

        .when('/detail/:id', {
            templateUrl: '/views/detail.html',
            controller: 'DetailCtl'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true).hashPrefix('!');

});

app.filter('trustHtml', function ($sce) {
    return function (input) {

        return input;
        // return marked(input);

    }

});

app.controller('listController',function($scope,$http,$timeout,promiseTracker) {
    /*
     $http.get(server_api+"article"+api_exe).then(function(response) {
        $scope.lists = response;
        $timeout(function() {
          alert('ninjas have arrived!');
        }, 2000);
      });
      */
    $http.get(server_api+"article"+api_exe).success(function(response) {$scope.lists = response;});
});

app.controller('searchController',function($scope,$http) {
    $scope.formData = {};
    $scope.formData.content = '';
    $scope.searchForm = function() {
        alert($scope.formData.content);
        $http.get(server_api+"article"+api_exe).success(function(response) {$scope.lists = response;});
    };
});


app.controller('DetailCtl',function($scope,$http, $routeParams,promiseTracker) {
    $http.get(server_api+"article/detail"+"/id/"+$routeParams.id+api_exe).success(function(response) {
        $scope.article = marked(response.detail);
        // console.log($scope.article);
    });
});


app.controller('EditCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {

    $scope.formData = {};
    $scope.formData.content = '';
    $scope.editView = true;
    $scope.toggle = function() {
        if($scope.editView){
            $scope.col = 6;
        }else{
            $scope.col = 12;
        }
        $scope.editView = !$scope.editView;
    };

    $scope.link = function() {
        $scope.formData.content += '[text](http://example.com/ "title")';
    };
    $scope.pre = function() {
        $scope.formData.content += '    ';
    };

    $scope.code = function() {
        $scope.formData.content += '``';
    };

    $scope.saveForm = function() {
        $scope.formData.content = '';
    };



    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.log = '';


    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/api/upload',
                    fields: {
                        'username': $scope.username
                    },
                    file: file
                }).progress(function (evt) {

                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' +
                        evt.config.file.name + '\n' + $scope.log;

                }).success(function (data, status, headers, config) {
                    $timeout(function() {
                        var json = data.file;
                        // savepath
                        $scope.formData.content += '[img]api/Uploads/'+  json.savepath+json.savename +'[/img]';
                        //$scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                    });
                });
            }
        }
    };

}]);

