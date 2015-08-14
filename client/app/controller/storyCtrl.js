angular.module('storyCtrl',['storyService'])

.controller('StoryController',function(Story,socketIO){
	var vm = this;

	Story.allUserStories()
		.success(function(data){
			vm.stories = data;
		});

	vm.createStory = function(){ // this need to be called
		vm.processing = true;
		vm.message = '';
		Story.create(vm.storyData) // this will be created on the view
			.success(function(data){
				vm.processing = false;
				//clear the form
				vm.storyData = {};

				vm.message = data.message;
			});
	};
	
	socketIO.on('story',function(data){
		
		vm.stories.push(data);
	})
})

.controller('AllStoriesController',function(stories,socketIO){
	var vm = this;

	vm.stories = stories.data;

	socketIO.on('story',function(data){ // key story is from the front end, got some new story from back end, 
		vm.stories.push(data); //push that into new stack
	}) 

});