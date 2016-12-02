var app = angular.module("main", ["ngRoute"]);

//configures the ng-app "main" so that when the url has /game at the end the game is loaded onto the screen
app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "login.html",
		controller: "loginController"
    })
    $routeProvider.when("/game",{
		templateUrl: "gameCanvas.html"
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
       user = $("#user").val();
	   
	   //gets a list of all users
	   var users = JSON.parse(getUser());
	   
	   //checks if user is a duplicate
		for(var i = 0; i < users.length; i++) {
			if(user == users[i].Username)
				return false;
		}
			 
		//if it isnt then username is stored
		$.post("sendUser.php",
		{
			newUser: user
		});	
	   return true;
}

function getUser() {
	var result = null;
     var scriptUrl = "getUsers.php";
     $.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            result = data;
        } 
     });
     return result;
}
