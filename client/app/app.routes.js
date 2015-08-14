angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider,$locationProvider){

	$routeProvider // huge state machine for router
		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller:'MainController',
			controllerAs:'main'
		})
		.when('/login',{
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup',{
			templateUrl: 'app/views/pages/signup.html'
		})
		.when('/logout',{})
		.when('/allStories',{
			templateUrl:'app/views/pages/allStories.html',
			controller:'AllStoriesController',
			controllerAs: 'allStories', // alias for allstorycontroller
			resolve: {
				stories: function(Story){ // check the story service for more info, basically Story is global object ? and allStory is a method defined in global service
					return Story.allStories();
				}
			}
		});
	$locationProvider.html5Mode(true); // enable this to use shorthand notation for link in the button

});