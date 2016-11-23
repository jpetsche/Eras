var app = angular.module("main", ["ngRoute"]);

//configures the ng-app "main" so that when the url has /game at the end the game is loaded onto the screen
app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "login.html",
		controller: "loginController"
    })
    $routeProvider.when("/game",{
		templateUrl: "test.html"
	})
});

//when the button is pressed /game is added to the url
app.controller("loginController", function($scope, $location){
	$scope.login = function(){
		if(submitMe())
			$location.url("/game");
	}
});

//makes a call the getusers.php to check for duplicate usernames and if it is not then sendUser.php is called to insert username into the database
function submitMe() {
       user = 'name='+$("#user").val();
	   
	   //checks if user is a duplicate
	   $.get("getUsers.php", function(data, status){
		   if(data != '') {
			data = JSON.parse(data);
			
			for(var i = 0; i < data.Username.length; i++) {
				if(user == data.Username[i])
					return false;
			}
		   }
	   });
		//if it isnt then username is stored
		$.post("sendUser.php",
		{
			newUser: user
		});	
	   return true;
}