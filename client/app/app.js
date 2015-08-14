angular.module('UserStoryApp',['appRoutes','mainCtrl','authService','userCtrl','storyCtrl','reverseDirective'])
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor'); // keep pushing the Auth into header request
})