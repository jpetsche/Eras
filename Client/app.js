var app = angular.module("main", ["ngRoute"]);

//configures the ng-app "main" so that when the url has /game at the end the game is loaded onto the screen 
//Not used because when gameCanvas.html is loaded it seems like the js file wasnt loaded
app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "login.html",
		controller: "loginController"
    })
    $routeProvider.when("/game",{
		templateUrl: "gameCanvas.html"
	})
});

//when the button is pressed user is redirected to the games html
app.controller("loginController", function($scope, $location){
	$scope.login = function(){
		if(submitMe())
			window.location.href = "http://proj-309-gp-05.cs.iastate.edu/gameCanvas.html";
	}
});

//makes a call the getusers.php to check for duplicate usernames and if it is not then sendUser.php is called to insert username into the database
function submitMe() {
       user = $("#user").val();
	   
	   //gets a list of all users
	   var users = JSON.parse(getUser());
	   
	   //checks if user is a duplicate
		for(var i = 0; i < users.length; i++) {
			if(user == users[i].Username) {
				$.post("setUsername.php",
				{
					user: user
				});	
				return true;
			}
		}
		
		
		//if it isnt then username is stored
		$.post("sendUser.php",
		{
			newUser: user,
			score: "0"
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
