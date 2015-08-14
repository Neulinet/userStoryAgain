angular.module('storyService',[])

.factory('Story',function ($http){
	var storyFactory = {};

	storyFactory.create = function(storyData){
		return $http.post('/api',storyData);
	}

	storyFactory.allUserStories = function (){
		return $http.get('/api');
	}

	storyFactory.allStories = function () {
		return $http.get('/api/all_stories');
	}

	return storyFactory;
})

// create socket IO for real time, dynamic change 
.factory('socketIO', function($rootScope) {
	var socket = io.connect(); // conect to target, this io object is imported from /socket.io/socket.js from the server side
	return { // return anonymous object and 2 lambda function
		on: function(eventName,callback){ // lambda function number 1 : on.

			socket.on(eventName,function(){  // refer to socket.IO API
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket,args);
				})
			})
		},
		emit: function(eventName,data,callback){ // 

			socket.emit(eventName,data,function(){

				var args = arguments;

				$rootScope.$apply(function(){

					if (callback) {
						callback.apply(socket,args);
					}
				})
			})
		}
	}
})