angular.module('authService', []) // sign this service up as a module, called authService

// global factory, whoever call this module inherit this factory 'Auth'
// https://docs.angularjs.org/api/ng/service/$q

.factory('Auth',function($http,$q,AuthToken){ // minification ready 

	var authFactory = {}; // this object/service will returned so all the function here is accessible, cotain all the necessary info

	authFactory.login = function(username,password) {// losely declare a function to send login info to, take in username and password

		return $http.post('/api/login',{ //post to the url designated in first parameter, request object type json, contain all the username,password
			username:username,
			password:password
		}).success(function(data){
			// success is a promise, will be call whenever get the response 200 from backend
			// it take in parameter which is a callback function, data will be the json contain
			// token send from the backend( refer to api.js for more detail) 
			AuthToken.setToken(data.token) // refer to setToken method below
			return data;
		}); 

	};

	// logout service
	authFactory.logout = function() {
		AuthToken.setToken(); // clear token
	};

	// this function act like a middleware to check the login status of a particular user
	authFactory.isLoggedIn = function () { 

		if (AuthToken.getToken()) // if token exist , refer to AuthToken module below
			return true; // then user is login
		else
			return false;

	}

	// extract user info from the token
	authFactory.getUser = function(){
		console.log('In get user');
		if (AuthToken.getToken()){ // check if token exist
			return $http.get('/api/me'); // call this API to get the actual decoded user info, 
										 // The middleware in API will block this if token is invalid
		}else{
			console.log('rejected');
			return $q.reject({message:"User has no token"}); // $q is a generic promise, will send a reject response with json contain reject message 
		}

	}

	return authFactory;
})

//
.factory('AuthToken', function($window){

	var authTokenFactory = {};
	// NOTE ABOUT SECURITY OF LOCALSTORAGE : REFER TO THIS http://www.drdobbs.com/web-development/the-localstorage-api/240000682

	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token'); // Get item base on key pair, must agree within ourselves that key for token is Token. 
													  // Refer to jquery and LocalStorage api for getItem method
	}

	authTokenFactory.setToken = function(token){
		if (token) // if itended to set token rather than logout and remove token
			$window.localStorage.setItem('token',token); // set value of token 
		else
			$window.localStorage.removeItem('token');
	}
	return authTokenFactory;
})

// to embedded token into header of the request

.factory('AuthInterceptor', function($q,$location,AuthToken){

	var interceptorFactory = {};

	// to embedded token into header of the request

	interceptorFactory.request = function(config) {

		var token = AuthToken.getToken(); // get token from local storage
		console.log('Pushing token to header')
		if (token){

			config.headers['x-access-token'] = token; // again, agreed within ourselves x-access-token will be the key of the token in the request
		}
		console.log(config);
		return config; // return modify config 
	}
	// if there is an error in the response, make user return to login page
	interceptorFactory.responseError = function(response){ 

		if (response.status == 403) // error:forbidden page, refer to api.use middleware to see the effect 
			$location.path('/login');

		return $q.reject(response); // pass the response back as a reject response

	}

	return interceptorFactory;
})