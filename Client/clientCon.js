/***************************************************************
*-------------------SETUP SERVER CONNECTION---------------------
***************************************************************/
var serverNumber = 0;
//initiate the web socket connection
var ws = new WebSocket('ws://proj-309-gp-05.cs.iastate.edu:5000', 'echo-protocol');
serverNumber = 1;
ws.onerror=function(event){
	window.alert("Error, could not connect");
    //connectS2();
}

function connectS2()
{
    var ws = new WebSocket('ws://proj-309-gp-05.cs.iastate.edu:5001', 'echo-protocol');
    serverNumber = 2;
    ws.onerror=function(event){
        window.alert("Error, could not connet to server 1 or server 2.");
    }
}

var drawnDead = 0;
var msg;
var curMove;

var moveObj = {
    player: 0,
    key: 0
}
var closeObj = {
    player: 0,
	key: "close"
}

var chatObj = {
    key: "chat",
    msg: "",
    user: ""
}

// updates highscores from db
function updateHighscores() {
	var highScores = {};
     $.ajax({
        url: "highscores.php",
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
			var scores = JSON.parse(data);
			highScores = {"key" : "scores", "score1" : scores[0].HighScore, "name1" : scores[0].Username, "score2" : scores[1].HighScore, "name2" : scores[1].Username, "score3" : scores[2].HighScore, "name3" : scores[2].Username};
        }
     });
	ws.send(JSON.stringify(highScores));
}

//send message to our web socket server
function sendMessage(message, username){
    chatObj.key = "chat";
    chatObj.msg = message;
    chatObj.user = username;
    ws.send(JSON.stringify(chatObj));
}

//send movement to server
function sendMove(id, move){
    moveObj.player = id;
    moveObj.key = move;
    ws.send(JSON.stringify(moveObj));
}

//send to server that a player has close browser
function sendClose(id) {
	closeObj.player = id;
	ws.send(JSON.stringify(closeObj));
}

//sends username to server
function sendUser(id) {
	var user = {"key" : "name", "name" : getUser(), "id": id};
	ws.send(JSON.stringify(user));
}

//ask for public update
function update(){
    ws.send("update");
}

//update player array
function updatePlayer()
{
    ws.send(JSON.stringify(playerObj));
}


/***************************************************************
*------------------HANDLE SERVER RESPONSE-----------------------
***************************************************************/
//listen for server response
ws.addEventListener("message", function(e) {
    //the data is the message we're sending back
    msg = e.data;

    //check if the message is which player you are
    if (msg == 1 || msg == 2 || msg == 3 || msg == 4 || msg == 0)
    {
        playerId = msg;

    }
    else if(msg == "connected")
    {
        window.alert("connected");
    }
    else if(msg == "attack")
    {
        playAttack();
    }
    else if(msg == "hit")
    {
        playHit();
    }
    else
    {
        msg = JSON.parse(msg);

        if(msg[0] == "highScores")
        {
            for(var i = 1; i <= 3; i++)
            {
                highScores[i] = msg[i];
            }
        }
		else if(msg[0] == "items"){
			for(var i = 1; i <= 11; i++)
            {
				itemObj[i] = msg[i];
			}
			drawFromServer();
		}
        else if(msg[0] == "players")
        {
            for(var i = 1; i <= 4; i++)
            {
                playerObj[i] = msg[i];
            }
            playerRect = playerObj[playerId];
            drawFromServer();
            updateChatName(playerObj[playerId].name);
        }
        else if(msg[0] == "projectiles")
        {
            for(var i = 1; i < 100; i++)
            {
                projObj[i] = msg[i];
            }
            drawFromServer();
        }
        else if(msg[0] == "obstructions")
        {
            for(var i = 1; i <= 15; i++)
            {
                obstObj[i] = msg[i];
            }
            drawFromServer();
        }
        else if(msg[0] == "chatLog")
        {
            console.log(msg);
            for(var i = 1; i <= 101; i++)
            {
                chatObj[i] = msg[i];
            }
            writeLog(chatObj);
        }
    }
});

//gets the current username of this client
function getUser() {
	var result = null;
     var scriptUrl = "username.php";
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
