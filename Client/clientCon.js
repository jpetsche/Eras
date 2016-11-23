/***************************************************************
*-------------------SETUP SERVER CONNECTION---------------------
***************************************************************/

//initiate the web socket connection
var ws = new WebSocket('ws://proj-309-gp-05.cs.iastate.edu:5000', 'echo-protocol');
ws.onerror=function(event){
	window.alert("Error, could not connect");
}

var drawnDead = 0;
var msg;
var curMove;
var moveObj = {
    player:0,
    key:0
}
var closeObj = {
    player:0,
	key:"close"
}

//send message to our web socket server
function sendMessage(){
    var message = document.getElementById('message').value;
    ws.send(JSON.stringify(message));
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
    if (msg == 1 || msg == 2 || msg == 3 || msg == 0)
    {
        playerId = msg;

    }
    else if(msg == "connected")
    {
        window.alert("connected");
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
        else if(msg[0] == "players")
        {
            for(var i = 1; i <= 4; i++)
            {
                playerObj[i] = msg[i];
            }
            playerRect = playerObj[playerId];
            drawFromServer();
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
            console.log(msg);
            for(var i = 1; i <= 15; i++)
            {
                obstObj[i] = msg[i];
            }
            drawFromServer();
        }
    }
});