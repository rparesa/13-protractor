'use strict';

var myApp = angular.module('MoviesApp', []);

//For movie list
myApp.controller('MoviesCtrl', ['$scope', '$http', function($scope, $http){
  $scope.ordering = '-gross'; //default ordering
  
  $http.get('data/movies-2015.json').then(function(response){
      var data = response.data;
      $scope.movies = data;
  });
}]);

//For movie blog
myApp.controller('BlogCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

	$http.get('data/blog.json').then(function(response) {
 		$scope.posts = response.data;
 	});

	$scope.postToBlog = function(){
		var title = $scope.newPost.title; //get values from form
	  var date = $filter('date')(Date.now(), 'yyyy-MM-ddTHH:mm:ss'); //format current time
		var body = $scope.newPost.body;

    //object that is the new post
		var theNewPost = {'title':title, 'date':date, 'content':body}; 

		//TODO: Add new post to the list of posts!

	};

}])