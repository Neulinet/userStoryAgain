angular.module('mainCtrl', []) // sign up this file as module, name mainCtrl for require purpose

.controller('MainController',function($rootScope,$location,Auth) {
	var vm = this; // refer to the current controller


	vm.loggedIn = Auth.isLoggedIn(); // check if user is logged in. provide status
		// Event listener , on changing route , callback function will be triggered

	$rootScope.$on('$routeChangeStart', function(){  

		vm.loggedIn = Auth.isLoggedIn(); // need to check this status againt whenever there is a navigation
		
		Auth.getUser()
			.then(function(data){ // then is a method inherit from $http object returned from authService,
								  // first parameter is a callback passed in the success case. Data here will be the JSON response from API
				vm.user = data.data;
			}); // doesn't specify action when get rejected because it is specify in the service
	});

	vm.doLogin = function() {

		vm.processing = true;

		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){

				vm.processing = false;

				Auth.getUser()
					.then(function(data){

						vm.user = data.data;
					});

				if (data.success) // set by api 
					$location.path('/'); // current location to homepage
				else
					vm.error = data.message;
			})
	}
	
	vm.doLogout =function(){

		Auth.logout();

		$location.path('/logout');
		
	}
});