'use strict';

var myApp = angular.module('MoviesApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']);

//configure routes
myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html',
			controller: 'MoviesCtrl'
		})
		.state('about', {
			url: '/about',
			templateUrl: 'partials/about.html'
		})
		.state('blog', {
			url: '/blogs',
			templateUrl: 'partials/blog.html',
			controller: 'BlogCtrl'
		})
		.state('detail', {
			url: '/details/:movie',
			templateUrl: 'partials/movie-detail.html',
			controller: 'DetailsCtrl'
		})
		.state('watchlist', {
			url: '/watchlist',
			templateUrl: 'partials/watchlist.html',
			controller: 'WatchListCtrl'
		})

		$urlRouterProvider.otherwise('/home');
}]);

//For movie list
myApp.controller('MoviesCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.ordering = '-gross'; //default ordering

  $http.get('data/movies-2015.json').then(function (response) {
		var data = response.data;
		$scope.movies = data;
  });
}]);

//For movie blog
myApp.controller('BlogCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

	$http.get('data/blog.json').then(function (response) {
		$scope.posts = response.data;
 	});

	$scope.postToBlog = function () {
		var title = $scope.newPost.title; //get values from form
		var date = $filter('date')(Date.now(), 'yyyy-MM-ddTHH:mm:ss'); //format current time
		var body = $scope.newPost.body;

    //object that is the new post
		var theNewPost = { 'title': title, 'date': date, 'content': body };

		//TODO: Add new post to the list of posts!
		$scope.posts.push(theNewPost);
	};

}]);

//For movie details
myApp.controller('DetailsCtrl', ['$scope', '$stateParams', '$filter', '$http', 'WatchListService', function ($scope, $stateParams, $filter, $http, WatchListService) {
	//console.log($stateParams.movie);

  $http.get('data/movies-2015.json').then(function (response) {
		var movies = response.data;

		var targetObj = $filter('filter')(movies, { //filter the array
			id: $stateParams.movie //for items whose id property is targetId
		}, true)[0]; //save the 0th result

		$scope.movie = targetObj;

		var omdbUri = 'http://www.omdbapi.com/?t=' + $scope.movie.title;
		return $http.get(omdbUri); //launch request and return promise for later
  })
	.then(function (response) { //on response from OMDB
		//save some omdb specific fields
		$scope.movie.Title = response.data.Title;
		$scope.movie.Year = response.data.Year;
		$scope.movie.imdbID = response.data.imdbID;
		$scope.movie.Poster = response.data.Poster;
		$scope.movie.Plot = response.data.Plot;
	});

  $scope.saveMovie = function(movie){
	 movie.priority = 2; //default
	 WatchListService.addMovie(movie);
  };

}]);


//For to-watch list
myApp.controller('WatchListCtrl', ['$scope', '$http', '$uibModal', 'WatchListService', function ($scope, $http, $uibModal, WatchListService) {

	//"constants" for priority setting
	$scope.priorities = ['Very High', 'High', 'Medium', 'Low', 'Very Low'];
	$scope.priority = 'Medium'; //default

	$scope.watchlist = WatchListService.watchlist;

	//run a search query
	$scope.searchFilms = function () {

		var omdbUri = 'http://www.omdbapi.com/?s=' + $scope.searchQuery + '&type=movie';
		console.log(omdbUri);
		$http.get(omdbUri).then(function (response) {
			console.log(response.data.Search); //response is inside the Search field
			$scope.searchResults = response.data.Search;

			//show modal!
			var modalInstance = $uibModal.open({
				templateUrl: 'partials/select-movie-modal.html', //partial to show
				controller: 'ModalCtrl', //controller for the modal
				scope: $scope //pass in all our scope variables!
			});

			//When the modal closes (with a result)
			modalInstance.result.then(function(selectedItem) {
				//put item on the scope!
				$scope.movie = selectedItem;
				console.log("Now selected: ", $scope.movie);
			});
		});
	}; //end of searchFilms

	$scope.saveFilm = function(movie, priority){
		movie.priority = $scope.priorities.indexOf(priority);
		WatchListService.addMovie(movie);
		$scope.movie = undefined; //clear the selected movie
	};

}]);

myApp.controller('ModalCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

	$scope.select = function(movie){
		$scope.selectedMovie = movie;
		//console.log('You selected', movie);
	}

	$scope.ok = function() {
		$uibModalInstance.close($scope.selectedMovie);
	};
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

}]);


myApp.factory('WatchListService',function() {
	var service = {};

	if(localStorage.watchlist !== undefined){
		service.watchlist = JSON.parse(localStorage.watchlist);
		//console.log(service.watchlist);
	}
	else {
		service.watchlist = [];
	}

	service.message = "Hello, I'm a service";
	service.addMovie = function(movie){
		service.watchlist.push(movie);
		localStorage.watchlist = JSON.stringify(service.watchlist);
		//console.log("saved ",localStorage.watchlist)
	};

	return service;
});








