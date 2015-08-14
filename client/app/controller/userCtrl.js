angular.module('userCtrl',['userService'])

.controller('UserController',function(User){

	var vm= this; // refer to this controller

	User.all() // call user. all to get all
		.success(function(data){
			vm.users = data; // this controller now hold an array of all user
		})

})

.controller('UserCreateController',function(User,$location,$window){

	var vm= this; // refer to this controller

	vm.signupUser = function() {
		vm.message= '';
		User.create(vm.userData) // implicitly create on the fly in login
			.then(function(response){
				vm.userData = {};
				vm.message = response.data.message;

				$window.localStorage.setItem('token',response.data.token); // set new token based on response (automatically login)
				$location.path('/'); // redirect people to home page
				
			})	
	};

})