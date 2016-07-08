'use strict';

var myApp = angular.module('MoviesApp', ['ngSanitize', 'ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('home',{
			url: '/home',
			templateUrl: 'partials/home.html'
		})
		.state('about',{
			url: '/about',
			templateUrl: 'partials/about.html'
		})
		.state('blog',{
			url: '/musings',
			templateUrl: 'partials/blog.html',
			controller: 'BlogCtrl'
		})
		.state('detail',{
			url: '/details/:movie',
			templateUrl: 'partials/movie-detail.html',
			controller: 'DetailsCtrl'
		})

		$urlRouterProvider.otherwise('/home');


}]);

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
		$scope.posts.push(theNewPost);
	};

}])

myApp.controller('DetailsCtrl', ['$scope', '$stateParams', '$filter', '$http', function($scope, $stateParams, $filter, $http){
	console.log($stateParams.movie);

  $http.get('data/movies-2015.json').then(function(response){
      var movies = response.data;

			var targetObj = $filter('filter')(movies, { //filter the array
      	id: $stateParams.movie //for items whose id property is targetId
   		}, true)[0]; //save the 0th result

			$scope.movie = targetObj;

  });



	//find the movie with the `$stateParmas.movie` id
	//show that one

	// $scope.movie = { 
  //    title: "An Example Movie",
  //    released: "7/6/16",
  //    distributor: "INFO 343",
  //    genre: "Educational",
  //    rating: "PG",
  //    gross: 1000000,
  //    tickets: 30
	// };
}])