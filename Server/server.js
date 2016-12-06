/***************************************************************
*--------------------Initialize js files------------------------
***************************************************************/
var col = require('./collision.js');
var obst = require('./obstruction.js');
var pro = require('./projectile.js');
var sc = require('./scores.js');
var chat = require('./chat.js');
var items = require('./item.js');
/***************************************************************
*---------------------INITIALIZE SERVER-------------------------
***************************************************************/

//Create Server and listen
var http = require('http');
var server = http.createServer(function(request, response) {});
server.listen(5000, function() {
    console.log((new Date()) + ' Server 1 is listening on port 5000');
});

//Create Web Socket Server
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

var chatObj = {};
var obstObj = {};
var highScores = {};
var itemObj = {};
var projObj = {};
var playerObj = {};
//store connected clients
var count = 0;
var clients = {};
var id;
var closedCon = null;
var range = 15;
chatObj[0] = "chatLog";
playerObj[0] = "players";
projObj[0] = "projectiles";
itemObj[0] = "items";
highScores[0] = "highScores";
obstObj[0] = "obstructions";
var gameTimer = 0;
obst.populateObstructions(obstObj);
items.spawnItems(itemObj);

//object to send through websockets so we are able
//to tell the difference between the player array,
//the projectile array, and the item array
var sendObj = {
    objName: "players",
    object: JSON.stringify(projObj)
}

var chatMsg = {
    key: "chat",
    msg: "",
    user: "Player 1"
}

var high1 = {
    score: 0,
    name: "name"
}
var high2 = {
    score: 0,
    name: "name"
}
var high3 = {
    score: 0,
    name: "name"
}
highScores[1] = high1;
highScores[2] = high2;
highScores[3] = high3;

//function to create player objects
function player()
{
    this.x = 10;
    this.y = 10;
    this.charNum = 1;
    this.lobbyNum = 1;
    this.name = "Player One";
    this.startX = 10;
    this.startY = 10;
    this.width = 50;
    this.height = 50;
    this.facing = "right";
    this.maxHealth = 5;
    this.health = 5;
    this.attack = 0;
    this.canAttack = 0;
    this.attackFrame = 0;
    this.score = 0;
    this.hasItem = 0;
    this.heldItem = itemObj[0];
}

//movement object to be sent to clients
var moveObj = {
    player:0,
    key:0
}

//Respawns a player that has died
// @author - Alec lucas
function playerRespawn(object){
  object.x = object.startX;
  object.y = object.startY;
  object.health = object.maxHealth;
  object.score = 0;
  object.attack = 0;
  if(object.charNum == 1 || object.charNum == 3)
  {
    object.facing = "right";
  }
  else
  {
    object.facing = "left";
  }
}


//timed method call that updates projectiles every 1/10th of a second
setInterval(function(){
    pro.updateProj(projObj, playerObj, highScores, clients, obstObj);

    for(var i = 1; i <= 4; i++)
    {
        if(clients[i] != null)
        {
            //add attack speed of one second
            if(playerObj[i].canAttack == 1 && playerObj[i].attackFrame <= 10)
            {
                if(playerObj[i].attackFrame == 10)
                {
                    playerObj[i].attackFrame = 0;
                    playerObj[i].canAttack = 0;
                }
                else
                {
                    playerObj[i].attackFrame++;
                }
            }
            clients[i].sendUTF(JSON.stringify(projObj));
        }
    }

}, 100);

/***************************************************************
*---------------------HANDLE CONNECTIONS------------------------
***************************************************************/
//Listen for connections
wsServer.on('request', function(r){
    //Handle the connection
    if(count <= 3){
        //accept the connection
        connection = r.accept('echo-protocol', r.origin);
        //specific id for this client and increment count
        count++;


        for(var i = 1; i <= 4; i++)
        {
            if(playerObj[i] == null)
            {
                var playerChar = new player();
                if(i == 1)
                {
                    playerObj[i] = playerChar;
                    playerObj[i].x = 10;
                    playerObj[i].y = 10;
                    playerObj[i].charNum = 1;
                    playerObj[i].lobbyNum = 1;
                    playerObj[i].name = "Player One";
                    playerObj[i].startX = 10;
                    playerObj[i].startY = 10;
                    playerObj[i].facing ="right";
                    clients[i] = connection;
                }
                else if(i == 2)
                {
                    playerObj[i] = playerChar;
                    playerObj[i].x = 740;
                    playerObj[i].y = 10;
                    playerObj[i].charNum = 2;
                    playerObj[i].lobbyNum = 1;
                    playerObj[i].name = "Player Two";
                    playerObj[i].startX = 740;
                    playerObj[i].startY = 10;
                    playerObj[i].facing ="left";
                    clients[i] = connection;
                }
                else if(i == 3)
                {
                    playerObj[i] = playerChar;
                    playerObj[i].x = 10;
                    playerObj[i].y = 540;
                    playerObj[i].charNum = 3;
                    playerObj[i].lobbyNum = 1;
                    playerObj[i].name = "Player Three";
                    playerObj[i].startX = 10;
                    playerObj[i].startY = 540;
                    playerObj[i].facing ="right";
                    clients[i] = connection;
                }
                else
                {
                    playerObj[i] = playerChar;
                    playerObj[i].x = 740;
                    playerObj[i].y = 540;
                    playerObj[i].charNum = 4;
                    playerObj[i].lobbyNum = 1;
                    playerObj[i].name = "Player Four";
                    playerObj[i].startX = 740;
                    playerObj[i].startY = 540;
                    playerObj[i].facing ="left";
                    clients[i] = connection;
                }
                //connection.sendUTF("connected");
                connection.sendUTF(i);
                break;
            }
        }

        for(var i = 1; i <= 4; i++)
        {
            if(clients[i] != null)
            {
                clients[i].sendUTF(JSON.stringify(playerObj));
                clients[i].sendUTF(JSON.stringify(projObj));
                clients[i].sendUTF(JSON.stringify(highScores));
                clients[i].sendUTF(JSON.stringify(obstObj));
                clients[i].sendUTF(JSON.stringify(itemObj));
                clients[i].sendUTF(JSON.stringify(chatObj));
            }
        }

        //log message to show that we have a new client connected
        console.log((new Date()) + ' Connection accepted, client count: ' + count);

    }
    // else if(count <= 7)
    // {
    //     //accept the connection
    //     connection = r.accept('echo-protocol', r.origin);
    //     //specific id for this client and increment count
    //     count++;
    // }
    else
    {
        //reject the connection, already four clients connected
        console.log((new Date()) + ' Connection rejected, too many clients');
        var badCon = r.accept('echo-protocol', r.origin);
        badCon.sendUTF("Too many players, connected is being rejected");
        badCon.close();
    }

    //Create an event listener for message
    connection.on('message', function(message) {
        var msgData = message.utf8Data;
        //check if the message is which client it is
        if (msgData == 1 || msgData == 2 || msgData == 3 || msgData == 4)
        {
            console.log((new Date()) + ' Message recieved ' + msgData);
        }
		//then check if it was a movement
        else if(msgData == "update")
        {
            for(var i = 1; i <= 4; i++)
            {
                if(clients[i] != null)
                {
                    clients[i].send(JSON.stringify(playerObj));
                }
            }
        }
        else
        {
            var hitWall = 0;
            var hitPlayer = 0;
            msgData = JSON.parse(msgData);

			//check if a username is being sent
			if (msgData.key == "name")
			{
				playerObj[msgData.id].name = msgData.name;
			}
			//checks for highscore update
			else if(msgData.key == "scores") {
				highScores[1] = { score : msgData.score1, name : msgData.name1};
				highScores[2] = { score : msgData.score2, name : msgData.name2};
				highScores[3] = { score : msgData.score3, name : msgData.name3};
			}
            //checks if respawn request was sent
            else if(msgData.key == "respawn" && playerObj[msgData.player].health < 1){
              playerRespawn(playerObj[msgData.player]);
            }
            //checks if chat message was sent
            else if(msgData.key == "chat")
            {
                chatMsg = msgData;
                chat.update(chatMsg, chatObj);
                for(var i = 1; i <= 4; i++)
                {
                    if(clients[i] != null)
                    {
                        clients[i].send(JSON.stringify(chatObj));
                    }
                }
            }
            /************************************
            *---------Handle Movements-----------
            ************************************/
            else if(msgData.key == "left" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], msgData.key, obstObj);
                hitPlayer = col.playerCollision(playerObj[msgData.player], msgData.key, playerObj);

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].x = playerObj[msgData.player].x - 1;
                }
                playerObj[msgData.player].facing = msgData.key;
            }
            else if(msgData.key == "right" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], msgData.key, obstObj);
                hitPlayer = col.playerCollision(playerObj[msgData.player], msgData.key, playerObj);

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].x = playerObj[msgData.player].x + 1;
                }
                playerObj[msgData.player].facing = msgData.key;
            }
            else if(msgData.key == "up" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], msgData.key, obstObj);
                hitPlayer = col.playerCollision(playerObj[msgData.player], msgData.key, playerObj);

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].y = playerObj[msgData.player].y - 1;
                }
                playerObj[msgData.player].facing = msgData.key;
            }
            else if(msgData.key == "down" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], msgData.key, obstObj);
                hitPlayer = col.playerCollision(playerObj[msgData.player], msgData.key, playerObj);

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].y = playerObj[msgData.player].y + 1;
                }
                playerObj[msgData.player].facing = msgData.key;
            }
            else if(msgData.key == "upleft" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], "up", obstObj);
                if(hitWall == 0)
                {
                    hitWall = col.wallCollision(playerObj[msgData.player], "left", obstObj);
                }
                hitPlayer = col.playerCollision(playerObj[msgData.player], "up", playerObj);
                if(hitPlayer == 0)
                {
                    hitPlayer = col.playerCollision(playerObj[msgData.player], "left", playerObj);
                }

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].x = playerObj[msgData.player].x - 1;
                    playerObj[msgData.player].y = playerObj[msgData.player].y - 1;
                }
                playerObj[msgData.player].facing = "up";
            }
            else if(msgData.key == "downleft" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], "down", obstObj);
                if(hitWall == 0)
                {
                    hitWall = col.wallCollision(playerObj[msgData.player], "left", obstObj);
                }
                hitPlayer = col.playerCollision(playerObj[msgData.player], "down", playerObj);
                if(hitPlayer == 0)
                {
                    hitPlayer = col.playerCollision(playerObj[msgData.player], "left", playerObj);
                }

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].x = playerObj[msgData.player].x - 1;
                    playerObj[msgData.player].y = playerObj[msgData.player].y + 1;

                }
                playerObj[msgData.player].facing = "down";
            }
            else if(msgData.key == "upright" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], "up", obstObj);
                if(hitWall == 0)
                {
                    hitWall = col.wallCollision(playerObj[msgData.player], "right", obstObj);
                }
                hitPlayer = col.playerCollision(playerObj[msgData.player], "up", playerObj);
                if(hitPlayer == 0)
                {
                    hitPlayer = col.playerCollision(playerObj[msgData.player], "right", playerObj);
                }

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].x = playerObj[msgData.player].x + 1;
                    playerObj[msgData.player].y = playerObj[msgData.player].y - 1;
                }
                playerObj[msgData.player].facing = "up";
            }
            else if(msgData.key == "downright" && playerObj[msgData.player].health > 0)
            {
                playerObj[msgData.player].attack = 0;
                //check for collisions before making the move
                hitWall = col.wallCollision(playerObj[msgData.player], "down", obstObj);
                if(hitWall == 0)
                {
                    hitWall = col.wallCollision(playerObj[msgData.player], "right", obstObj);
                }
                hitPlayer = col.playerCollision(playerObj[msgData.player], "down", playerObj);
                if(hitPlayer == 0)
                {
                    hitPlayer = col.playerCollision(playerObj[msgData.player], "right", playerObj);
                }

                if(hitWall == 0 && hitPlayer == 0) //if no collision is detected, move
                {
                    playerObj[msgData.player].x = playerObj[msgData.player].x + 1;
                    playerObj[msgData.player].y = playerObj[msgData.player].y + 1;
                }
                playerObj[msgData.player].facing = "down";
            }
			else if(msgData.key == "close")
			{
                //handle a player disconnecting
				console.log("hes outa here");
                playerRespawn(playerObj[msgData.player]);
				playerObj[msgData.player] = null;
                clients[msgData.player] = null;
			}
            else if(msgData.key == "attack" && playerObj[msgData.player].health > 0)
            {
                if(playerObj[msgData.player].canAttack == 0)
                {
                    playerObj[msgData.player].attack = 1;
                    playerObj[msgData.player].canAttack = 1;
                    playerObj[msgData.player].attackFrame = gameTimer;
                    pro.shootProj(playerObj[msgData.player], projObj, clients);
                }
            }
            else if(msgData.key == "equip" && playerObj[msgData.player].health > 0)
            {
                //equip an item without holding an item
                if(playerObj[msgData.player].hasItem == 0){
                  hitItem = col.itemCollision(playerObj[msgData.player], itemObj);
                  if(hitItem != 0)
                  {
                    playerObj[msgData.player].hasItem = 1;
                    playerObj[msgData.player].heldItem = itemObj[hitItem];
                    itemObj[hitItem].held = 1;
                    itemObj[hitItem].x = -50;
                    itemObj[hitItem].y = -50;
                  }

                }
                //equip an item and drop currently held item
                else{
                  hitItem = col.itemCollision(playerObj[msgData.player], itemObj);
                  if(hitItem != 0)
                  {
                    var tempX = itemObj[hitItem].x;
                    var tempY = itemObj[hitItem].y;
                    var dropped = playerObj[msgData.player].heldItem;
                    playerObj[msgData.player].heldItem = itemObj[hitItem];
                    if(dropped.type == "armor"){
                    playerObj[msgData.player].health = playerObj[msgData.player].health - dropped.durability;
                    }
                    itemObj[hitItem].held = 1;
                    itemObj[hitItem].x = -50;
                    itemObj[hitItem].y = -50;

                    for(var i = 1; i <= 11; i++)
                    {
                      if(itemObj[i] == dropped)
                      {
                        itemObj[i].x = tempX;
                        itemObj[i].y = tempY;
                        itemObj[i].held = 0;
                        break;
                      }
                    }
                  }
                  //to drop a held item
                  else if(hitItem == 0){
                    var newX = playerObj[msgData.player].x + 25;
                    var newY = playerObj[msgData.player].y + 25;
                    var dropped = playerObj[msgData.player].heldItem;
                    playerObj[msgData.player].heldItem = itemObj[0];
                    playerObj[msgData.player].hasItem = 0;
                    if(dropped.type == "armor"){
                      playerObj[msgData.player].health = playerObj[msgData.player].health - dropped.durability;
                    }
                    for(var i = 1; i <= 11; i++)
                    {
                      if(itemObj[i] == dropped)
                      {
                        itemObj[i].x = newX;
                        itemObj[i].y = newY;
                        itemObj[i].held = 0;
                        break;
                      }
                    }
                  }
                }

                if(playerObj[msgData.player].hasItem == 1)
                {
                  var tempItem = playerObj[msgData.player].heldItem;
                  if(tempItem.durability != 0)
                  {
                    if(tempItem.type == "speed"){
                      //place holder for movement speed
                    }
                    else if(tempItem.type == "healing"){
                      if(playerObj[msgData.player].health != playerObj[msgData.player].maxHealth){
                        playerObj[msgData.player].health = playerObj[msgData.player].maxHealth;
                        tempItem.durability = 0;
                      }
                    }
                    else if(tempItem.type == "atkSpeed"){
                      //place holder for attack speed
                    }
                    else if(tempItem.type == "atkStrength"){
                      //place holder for attack strength
                    }
                    else if(tempItem.type == "armor"){
                      playerObj[msgData.player].health = playerObj[msgData.player].health + tempItem.durability;
                    }
                  }
                }

                for(var i = 1; i <= 4; i++)
                {
                    if(clients[i] != null)
                    {
                        clients[i].sendUTF(JSON.stringify(itemObj));
                    }
                }
            }
            else
            {
                //console.log((new Date()) + " Message recieved from Client: " + msgData.key);
            }

            //loop through all clients and update the player array
            //do this every single time any action occurs at all;
            for(var i = 1; i <= 4; i++)
            {
                if(clients[i] != null)
                {
                    clients[i].sendUTF(JSON.stringify(playerObj));
                }
            }
        }

    });

    //listen for client disconnecting
    connection.on('close', function(reasonCode, description){
        count--;
        //console log message to show which client disconnected
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});
