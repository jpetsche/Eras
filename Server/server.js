/***************************************************************
*--------------------Initialize js files------------------------
***************************************************************/
var col = require('./collision.js');
console.log('loaded the collision.js file');
var obst = require('./obstruction.js');
console.log('loaded the obstruction.js file');
/***************************************************************
*---------------------INITIALIZE SERVER-------------------------
***************************************************************/

//Create Server and listen
var http = require('http');
var server = http.createServer(function(request, response) {});
server.listen(5000, function() {
    console.log((new Date()) + ' Server is listening on port 5000');
});

//Create Web Socket Server
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

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
playerObj[0] = "players";
projObj[0] = "projectiles";
itemObj[0] = "items";
highScores[0] = "highScores";
obstObj[0] = "obstructions";
var gameTimer = 0;
obst.populateObstructions();

//object to send through websockets so we are able
//to tell the difference between the player array,
//the projectile array, and the item array
var sendObj = {
    objName: "players",
    object: JSON.stringify(projObj)
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

//character object for each client
var player1 = {
    charNum:1,
    name: "Player One",
    startX: 10,
    startY: 10,
    x:10,
    y:10,
    width:50,
    height:50,
    facing: "right",
    maxHealth: 5,
    health: 5,
    attack: 0,
    canAttack: 0,
    attackFrame: 0,
    score: 0
}

var player2 = {
    charNum:2,
    name: "Player Two",
    startX: 740,
    startY: 10,
    x:740,
    y:10,
    width:50,
    height:50,
    facing: "left",
    maxHealth: 5,
    health: 5,
    attack: 0,
    canAttack: 0,
    attackFrame: 0,
    score: 0
}

var player3 = {
    charNum:3,
    name: "Player Three",
    startX: 10,
    startY: 540,
    x:10,
    y:540,
    width:50,
    height:50,
    facing: "right",
    maxHealth: 5,
    health: 5,
    attack: 0,
    canAttack: 0,
    attackFrame: 0,
    score: 0
}

var player4 = {
    charNum:4,
    name: "Player Four",
    startX: 740,
    startY: 540,
    x:740,
    y:540,
    width:50,
    height:50,
    facing: "left",
    maxHealth: 5,
    health: 5,
    attack: 0,
    canAttack: 0,
    attackFrame: 0,
    score: 0
}

//projectile for ranged attacks
function projectile(num) {
    this.x = 0;
    this.y = 0;
    this.width = 20;
    this.height = 20;
    this.moving = "right";
    this.damage = 1;
    this.destroyed = 0;
    this.launchedBy = 0;
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

//function that creates and shoots the projectile
function shootProj(player) {
    for(var i = 1; i < 100; i++)
    {
        if(projObj[i] == null)
        {
            var proj = new projectile(i);
            projObj[i] = proj;
            projObj[i].moving = player.facing;
            projObj[i].damage = 1;
            projObj[i].launchedBy = player.charNum;
            if(projObj[i].moving == "left")
            {
                projObj[i].x = player.x - 20;
                projObj[i].y = player.y + 15;
            }
            else if(proj.moving == "right")
            {
                projObj[i].x = player.x + 50;
                projObj[i].y = player.y + 15;
            }
            else if(proj.moving == "up")
            {
                projObj[i].x = player.x + 15;
                projObj[i].y = player.y - 20;
            }
            else//projectile.moving is down
            {
                projObj[i].x = player.x + 15;
                projObj[i].y = player.y + 50;
            }
            projObj[i].damage = 1;
            projObj[i].destroyed = 0;
            break;
        }
    }
}

//function that updates all of the projectiles
function updateProj(){
    for(var i = 1; i < 100; i++)
    {
        if(projObj[i] != null)
        {
            var hit = col.projCol(projObj[i], playerObj);

            if(projObj[i].moving == "left")
            {
                if(hit == -1)
                {
                    projObj[i].x = projObj[i].x - 5;
                }
                else if(hit == 5)
                {
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
                else
                {
                    playerObj[hit].health = playerObj[hit].health - projObj[i].damage;
                    if(playerObj[hit].health > 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 10;
                        }
                    }
                    else if(playerObj[hit].health == 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 50;
                        }
                        setHighScores(playerObj[hit]);
                    }
                    for(var a = 1; a <= 4; a++)
                    {
                        if(clients[a] != null)
                        {
                            clients[a].sendUTF(JSON.stringify(playerObj));
                        }
                    }
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
            }
            else if(projObj[i].moving == "right")
            {
                if(hit == -1)
                {
                    projObj[i].x = projObj[i].x + 5;
                }
                else if(hit == 5)
                {
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
                else
                {
                    playerObj[hit].health = playerObj[hit].health - projObj[i].damage;
                    if(playerObj[hit].health > 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 10;
                        }
                    }
                    else if(playerObj[hit].health == 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 50;
                        }
                        setHighScores(playerObj[hit]);
                    }
                    for(var a = 1; a <= 4; a++)
                    {
                        if(clients[a] != null)
                        {
                            clients[a].sendUTF(JSON.stringify(playerObj));
                        }
                    }
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
            }
            else if(projObj[i].moving == "up")
            {
                if(hit == -1)
                {
                    projObj[i].y = projObj[i].y - 5;
                }
                else if(hit == 5)
                {
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
                else
                {
                    playerObj[hit].health = playerObj[hit].health - projObj[i].damage;
                    if(playerObj[hit].health > 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 10;
                        }
                    }
                    else if(playerObj[hit].health == 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 50;
                        }
                        setHighScores(playerObj[hit]);
                    }
                    for(var a = 1; a <= 4; a++)
                    {
                        if(clients[a] != null)
                        {
                            clients[a].sendUTF(JSON.stringify(playerObj));
                        }
                    }
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
            }
            else//projectile.moving is down
            {
                if(hit == -1)
                {
                    projObj[i].y = projObj[i].y + 5;
                }
                else if(hit == 5)
                {
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
                else
                {
                    playerObj[hit].health = playerObj[hit].health - projObj[i].damage;
                    if(playerObj[hit].health > 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 10;
                        }
                    }
                    else if(playerObj[hit].health == 0)
                    {
                        if(playerObj[projObj[i].launchedBy].health > 0)
                        {
                            playerObj[projObj[i].launchedBy].score = playerObj[projObj[i].launchedBy].score + 50;
                        }
                        setHighScores(playerObj[hit]);
                    }
                    for(var a = 1; a <= 4; a++)
                    {
                        if(clients[a] != null)
                        {
                            clients[a].sendUTF(JSON.stringify(playerObj));
                        }
                    }
                    projObj[i].destroyed = 1;
                    projObj[i] = null;
                }
            }
        }
    }
}

//timed method call that updates projectiles every 1/10th of a second
setInterval(function(){
    updateProj();

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

//method that sets highscores
function setHighScores(person)
{
    console.log("high Score called by " + person.name);
    if(person.score > highScores[1].score)
    {
        //move old scores down
        highScores[3].score = highScores[2].score;
        highScores[3].name = highScores[2].name;
        highScores[2].score = highScores[1].score;
        highScores[2].name = highScores[1].name;
        highScores[1].score = person.score;
        highScores[1].name = person.name;
    }
    else if(person.score > highScores[2].score)
    {
        //move old scores down
        highScores[3].score = highScores[2].score;
        highScores[3].name = highScores[2].name;
        highScores[2].score = person.score;
        highScores[2].name = person.name;
    }
    else if(person.score > highScores[3].score)
    {
        highScores[3].score = person.score;
        highScores[3].name = person.name;
    }

    for(var c = 1; c <= 4; c++)
    {
        if(clients[c] != null)
        {
            clients[c].sendUTF(JSON.stringify(highScores));
        }
    }
}

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
                if(i == 1)
                {
                    playerObj[i] = player1;
                    clients[i] = connection;
                }
                else if(i == 2)
                {
                    playerObj[i] = player2;
                    clients[i] = connection;
                }
                else if(i == 3)
                {
                    playerObj[i] = player3;
                    clients[i] = connection;
                }
                else
                {
                    playerObj[i] = player4;
                    clients[i] = connection;
                }
                connection.sendUTF("connected");
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
            }
        }

        //log message to show that we have a new client connected
        console.log((new Date()) + ' Connection accepted, client count: ' + count);

    }else{
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
        }//then check if it was a movement
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

            //checks if respawn request was sent
            if(msgData.key == "respawn" && playerObj[msgData.player].health < 1){
              playerRespawn(playerObj[msgData.player]);
            }
            //checks if movemnt request was sent
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
                    shootProj(playerObj[msgData.player]);
                }
            }
            else if(msgData.key == "equip" && playerObj[msgData.player].health > 0){
              //place holder for equiping an item
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

/***************************************************************
*--------------------Get data from database------------------------
***************************************************************/

function getUsers() {

}
