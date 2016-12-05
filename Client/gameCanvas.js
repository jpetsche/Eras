/***************************************************************
*------------------------SETUP CANVAS---------------------------
***************************************************************/

//disabling form reset when enter is pressed
$(function() {
  $("form").submit(function() {return false;});
});

//holds value of keyDown
var keymap = {32: false, 37: false, 38: false, 39: false, 40: false,
  65: false, 68: false, 69: false, 82: false, 83: false, 87: false, 13: false};

/***************************************************
*--------------loads HTML Attributes----------------
***************************************************/
//game canvas
var canvas = document.getElementById("gameBorder");

/***************************************************
*-------------------loads images--------------------
***************************************************/
var walkleft1 = new Image();//warrior walk left sprite
walkleft1.src = "images/sprites/walk-left-1.png";
var walkright1 = new Image();//warrior walk right sprite
walkright1.src = "images/sprites/walk-right-1.png";
var walkup1 = new Image();//warrior walk up sprite
walkup1.src = "images/sprites/walk-up-1.png";
var walkdown1 = new Image();//warrior walk down sprite
walkdown1.src = "images/sprites/walk-down-1.png";
var attackleft5 = new Image();//warrior attack left sprite
attackleft5.src = "images/sprites/attack-left-5.png";
var attackright5 = new Image();//warrior attack right sprite
attackright5.src = "images/sprites/attack-right-5.png";
var attackup5 = new Image();//warrior attack up sprite
attackup5.src = "images/sprites/attack-up-5.png";
var attackdown5 = new Image();//warrior attack down sprite
attackdown5.src = "images/sprites/attack-down-5.png";
var die6 = new Image();//warrior dead sprite
die6.src = "images/sprites/die-6.png";
var expl = new Image();//fireball
expl.src = "images/expl_02_0015.png";
var boulder = new Image();//boulder obstruction
boulder.src = "images/boulder.png";
var grass = new Image();//grass background
grass.src = "images/grass.png";
var gameover = new Image();//GAME OVER image
gameover.src = "images/gameover.png";
var speed = new Image();//Speed potion image
speed.src = "images/speed.png";
var healing = new Image();//Healing potion image
healing.src = "images/healing.png";
var atkSpeed = new Image();//atkSpeed potion image
atkSpeed.src = "images/atkSpeed.png";
var atkStrength = new Image(); //atkStrength postion image
atkStrength.src = "images/atkStrength.png";
var armor = new Image(); //armor immage
armor.src = "images/armor.png";
var tree = new Image();//tree image
tree.src = "images/tree.png";
var rock = new Image();//rock image
rock.src = "images/rock.png";
var water = new Image();//water image
water.src = "images/water.png";
var mud = new Image();//mud image
mud.src = "images/mud.png";
var emptyBottle = new Image();
emptyBottle.src = "images/emptyBottle.png";

/***************************************************
*-------------------loads sounds--------------------
***************************************************/
var shootfireball = new Audio("audio/shootfireball1.wav");//audio, shoot fireball
var fireballhit = new Audio("audio/fireballhit1.wav");//audio, fireball explodes

/***************************************************
*-------------Game Objects and Arrays---------------
***************************************************/
var numPlayers = 0;
var playerObj = {};
var playerId;
var projObj = {};
var itemObj = {};
var obstObj = {};
var chatObj = {};
var ctx = {};

ctx[0] = canvas.getContext("2d");
var start;
var keyDown = false;

//projectile for ranged attacks
var projectile = {
  x: 0,
  y: 0,
  width: 10,
  height: 10,
  moving: "right",
  damage: 1,
  destroyed: 0,
  launchedBy: 0
}

//object for highScores
//high Scores object
var highScores = {};
highScores[0] = "highScores";
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

/***************************************************************
*----------------------Chatlog Sending--------------------------
***************************************************************/
//updates the welcome message on the chat log
function updateChatName(playerName)
{
  var welcMsg = "Welcome, " + playerName + "!";
  var element;
  element = document.getElementById("welcomeMsg");
  element.innerHTML = welcMsg;
}

//calls the methods to send the message when the send button is clicked
document.getElementById("submitmsg").onclick = function() {
  chatLog(document.getElementById("usermsg").value)
};

//sends the message via the sendMessage function
function chatLog(message)
{
  sendMessage(message, playerObj[playerId].name);
  document.getElementById("usermsg").value = "";
}

//writes the updated messages into the message log
function writeLog(chatObj)
{
  var count = 1;
  var curMsg = chatObj[1];
  var element;
  while(count <= 20)
  {
    if(chatObj[curMsg] != null)
    {
      element = document.getElementById("log"+count);
      element.innerHTML = chatObj[curMsg].user + ": " + chatObj[curMsg].msg;
    }
    else
    {
      element = document.getElementById("log"+count);
      element.innerHTML = "";
    }

    if(curMsg == 2)
    {
      curMsg = 101;
    }
    else
    {
      curMsg--;
    }
    count++;
  }
}
/***************************************************************
*-----------------------CANVAS DRAWING--------------------------
***************************************************************/

//function that plays attack audio
function playAttack()
{
  shootfireball.currentTime = 0;
  shootfireball.play();
}

//function that plays hit audio
function playHit()
{
  fireballhit.currentTime = 0;
  fireballhit.play();
}

//draw background
function drawBack(context)
{
  context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height - 50);
  var pat = context.createPattern(grass, "repeat");
  context.rect(0, 0, canvas.width, canvas.height - 50);
  context.fillStyle = pat;
  context.fill();
}

//function to draw the obstructions
//thing is the obstruction object
function drawObstructions(context, thing)
{
  context.beginPath();
  context.rect(thing.x, thing.y, thing.width, thing.height);

  //set the correct image for what is being drawn
  if(thing.type == "tree")
  {
    context.drawImage(tree, thing.x, thing.y, thing.width, thing.height);
  }
  else if(thing.type == "rock")
  {
    context.drawImage(rock, thing.x, thing.y, thing.width, thing.height);
  }
  else if(thing.type == "boulder")
  {
    context.drawImage(boulder, thing.x, thing.y, thing.width, thing.height);
  }
  else if(thing.type == "water")
  {
    context.drawImage(water, thing.x, thing.y, thing.width, thing.height);
  }
  else if(thing.type == "mud")
  {
    context.drawImage(mud, thing.x, thing.y, thing.width, thing.height);
  }
  else if(thing.type == "wall")
  {
    if(thing.direction == 0)
    {
      context.drawImage(wall0, thing.x, thing.y, thing.width, thing.height);
    }
    else
    {
      context.drawImage(wall1, thing.x, thing.y, thing.width, thing.height);
    }
  }
}

function drawItems(context, item){
  context.beginPath();
  context.rect(item.x, item.y, item.width, item.height);

  if(item.type == "speed"){
    if(item.durability == 0){
      context.drawImage(emptyBottle, item.x, item.y, item.width, item.height);
    }
    else {
    context.drawImage(speed, item.x, item.y, item.width, item.height);
    }
  }
  else if(item.type == "healing"){
    if(item.durability == 0){
      context.drawImage(emptyBottle, item.x, item.y, item.width, item.height);
    }
    else{
      context.drawImage(healing, item.x, item.y, item.width, item.height);
    }
  }
  else if(item.type == "atkSpeed"){
    if(item.durability == 0){
      context.drawImage(emptyBottle, item.x, item.y, item.width, item.height);
    }
    else{
    context.drawImage(atkSpeed, item.x, item.y, item.width, item.height);
    }
  }
  else if(item.type == "atkStrength"){
    if(item.durability == 0){
      context.drawImage(emptyBottle, item.x, item.y, item.width, item.height);
    }
    else{
    context.drawImage(atkStrength, item.x, item.y, item.width, item.height);
    }
  }
  else if(item.type == "armor"){
    context.drawImage(armor, item.x, item.y, item.width, item.height);
  }
}

//draw gameover image
function drawGameOver(context)
{
  //draw the GAMEOVER image
  context.beginPath();
  context.rect(200, 200, 400, 200);
  context.drawImage(gameover, 200, 200, 400, 200);

  //draw background box so you can see game scores
  context.beginPath();
  context.rect(280, 320, 230, 240);
  context.fillStyle = 'grey';
  context.fill();

  //draw your score
  context.beginPath();
  context.rect(300, 350, 200, 100);
  context.font = "18px Georgia";
  context.fillStyle = "red";
  var scoreSt = "Your score was: " + playerObj[playerId].score;
  context.fillText(scoreSt, 300, 350, 200, 100);

  //update scores in database
  $.post("updateScore.php",
  {
	  user: playerObj[playerId].name,
	  score: playerObj[playerId].score
  });

  //write HIGH SCORES
  context.beginPath();
  context.rect(300, 400, 200, 100);
  context.font = "25px Georgia";
  context.fillStyle = "blue";
  var words = "HIGH SCORES";
  context.fillText(words, 300, 400, 200, 100);

  //draw high score 1
  context.beginPath();
  context.rect(300, 450, 200, 100);
  context.font = "25px Georgia";
  context.fillStyle = "blue";
  words = highScores[1].name + ": " + highScores[1].score;
  context.fillText(words, 300, 450, 200, 100);

  //draw high score 2
  context.beginPath();
  context.rect(300, 500, 200, 100);
  context.font = "25px Georgia";
  context.fillStyle = "blue";
  words = highScores[2].name + ": " + highScores[2].score;
  context.fillText(words, 300, 500, 200, 100);

  //draw high score 3
  context.beginPath();
  context.rect(300, 550, 200, 100);
  context.font = "25px Georgia";
  context.fillStyle = "blue";
  words = highScores[3].name + ": " + highScores[3].score;
  context.fillText(words, 300, 550, 200, 100);
}

//draws the projectiles
function drawProjectiles(proj,context)
{
    context.beginPath();
    context.rect(proj.x, proj.y, proj.width, proj.height);
    context.drawImage(expl, proj.x, proj.y, proj.width, proj.height);
}

//Draws the players
function drawRect(rect, context, id){
  context.beginPath();
  context.rect(rect.x, rect.y, rect.width, rect.height);
  context.font = "8px Georgia"; //set font type for health value
  var sprite;

  //figure out which direction the player is walking and load sprite accordingly
  if(rect.health <= 0)
  {
		sprite = die6;
  }
  else if(rect.facing == 'left')
  {
    if(rect.attack == 1)
    {
      sprite = attackleft5;
    }
    else
    {
      sprite = walkleft1;
    }
  }
  else if(rect.facing == 'right')
  {
    if(rect.attack == 1)
    {
      sprite = attackright5;
    }
    else
    {
      sprite = walkright1;
    }
  }
  else if(rect.facing == 'up')
  {
    if(rect.attack == 1)
    {
      sprite = attackup5;
    }
    else
    {
      sprite = walkup1;
    }
  }
  else if(rect.facing == 'down')
  {
    if(rect.attack == 1)
    {
      sprite = attackdown5;
    }
    else
    {
      sprite = walkdown1;
    }
  }

  context.drawImage(sprite, rect.x, rect.y, rect.width, rect.height);

	//now draw the health bar and username
	healthBar(rect, context, id);

	if(rect.health <= 0) // for dead player
		deadUsername(rect, context, id);
	else // for living player
		username(rect, context, id);
}

//function for health bar
function healthBar(rect, context, id)
{
  context.beginPath();
  context.rect(rect.x, rect.y - 10, rect.width, 10);
  context.fillStyle = 'red';
  context.fill();
  context.beginPath();
  if(rect.health >= 5)
  {
    context.rect(rect.x, rect.y - 10, 50, 10);
  }
  else
  {
    context.rect(rect.x, rect.y - 10, 10*rect.health, 10);
  }
  context.fillStyle = 'green';
  context.fill();
  context.beginPath();
  context.rect(rect.x, rect.y - 3, 50, 10);
  context.fillStyle = 'white';
  var lifePoints = "         " + rect.health + "/5";
  context.font = "8px Georgia";
  context.fillText(lifePoints, rect.x, rect.y-3, 50, 10);

}

//function for username above each player
function username(rect, context, id)
{
	context.beginPath();
	context.fillStyle = "black";
	context.font = "bold 8px Georgia";
	context.fillText(playerObj[id].name, rect.x, rect.y-12, 50, 10);
}

//function for username above each dead player
function deadUsername(rect, context, id)
{
	context.beginPath();
	context.fillStyle = "black";
	context.font = "bold 8px Georgia";
	context.fillText("RIP " + playerObj[id].name, rect.x, rect.y-12, 50, 10);
}

//function to draw the player UI at the bottom of the canvas
function drawUI(context)
{
  //draw UI box at bottom of canvas
  context.beginPath();
  context.rect(0, 600, 800, 50);
  context.fillStyle = 'white';
  context.fill();

  //draw character image
  context.beginPath();
  context.rect(10, 600, 50, 50);
  context.drawImage(walkdown1, 10, 600, 50, 50);

  //draw user health
  context.beginPath();
  context.rect(70, 610, 100, 30);
  context.fillStyle = 'red';
  context.fill();
  context.beginPath();
  if(playerObj[playerId].health >= 5)
  {
    context.rect(70, 610, 100, 30);
  }
  else
  {
    context.rect(70, 610, playerObj[playerId].health*20, 30);
  }
  context.fillStyle = 'green';
  context.fill();
  context.beginPath();
  context.rect(70, 630, 100, 30);
  context.fillStyle = 'white';
  var lifePoints = "      " + playerObj[playerId].health + "/5";
  context.font = "24px Georgia";
  context.fillText(lifePoints, 70, 630, 100, 30);

  //draw your score
  context.beginPath();
  context.rect(190, 635, 200, 30);
  context.fillStyle = 'blue';
  var scoreString = "SCORE: " + playerObj[playerId].score;
  context.font = "30px Georgia";
  context.fillText(scoreString, 190, 635, 200, 30);

  //draw current high score
  context.beginPath();
  context.rect(390, 635, 200, 30);
  context.fillStyle = 'blue';
  var highScoreString = "HIGH SCORE: " + highScores[1].score;
  context.font = "30px Georgia";
  context.fillText(highScoreString, 390, 635, 200, 30);

  //draw username
  context.beginPath();
  context.rect(650, 635, 200, 30);
  context.fillStyle = 'blue';
  var name = playerObj[playerId].name;
  context.font = "30px Georgia";
  context.fillText(name, 650, 635, 200, 30);
}

var playerRect = {
  charNum: 0,
  name: "Player One",
  startX: 10,
  startY: 10,
  x: 10,
  y: 10,
  width: 50,
  height: 50,
  facing: "right",
  maxHealth: 5,
  health: 5,
  attack: 0,
  canAttack: 0,
  attackFrame: 0,
  score: 0
};

/***************************************************************
*------------------UPDATE CANVAS FROM SERVER--------------------
***************************************************************/

function drawFromServer() {
  //clear the previous squares
  //ctx[0].clearRect(0, 0, canvas.width, canvas.height);

  //draw the grass background
  drawBack(ctx[0]);
  drawUI(ctx[0]);

  //draw the items
  for(var i = 1; i <=11; i++){
    if(itemObj[i] != null){
      var curItem = itemObj[i];
      if(curItem.held == 0){
        drawItems(ctx[0], curItem);
      }
    }
  }

	//draws the new player in its new position
  for(var i = 1; i <= 4; i++)
  {
    if(playerObj[i] != null)
    {
      var curPlayer = playerObj[i];
      drawRect(curPlayer, ctx[0], i);
    }
  }

  //draw the obstructions
  for(var i = 1; i <= 15; i++)
  {
    if(obstObj[i] != null)
    {
      var curObstr = obstObj[i];
      drawObstructions(ctx[0], curObstr);
    }
  }

  //draws the projectiles in their updated positions
  for(var i = 1; i < 100; i++)
  {
    if(projObj[i] != null)
    {
      var curProj = projObj[i];
      drawProjectiles(curProj, ctx[0]);
    }
  }

  //draw the game over screen if health reaches 0
  if(playerRect.health == 0)
  {
    drawGameOver(ctx[0]);
  }
}

/***************************************************************
*-----------------UPDATE CANVAS FROM KEYPRESS-------------------
***************************************************************/
var timer = null;
var pressed = 0;
//function that loops until key release
function keypress(move)
{
  if(pressed == 0)
  {
    if(move == "equip")
    {
      sendMove(playerId, move);
    }
    else
    {
      timer = setInterval(function() { sendMove(playerId, move);}, 30);
    }
    pressed = 1;
  }
  else if(pressed == 1)
  {
    if(isleft == 1 && isup == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "upleft");}, 30);
    }
    else if(isright == 1 && isup == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "upright");}, 30);
    }
    else if(isleft == 1 && isdown == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "downleft");}, 30);
    }
    else if(isright == 1 && isdown == 1)
    {
      clearInterval(timer);
      timer = setInterval(function() { sendMove(playerId, "downright");}, 30);
    }
  }
}

//function that stops the loop of sending movements
function stopkey()
{
  clearInterval(timer);
  if(isleft == 1 && isup == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "upleft");}, 30);
  }
  else if(isright == 1 && isup == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "upright");}, 30);
  }
  else if(isleft == 1 && isdown == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "downleft");}, 30);
  }
  else if(isright == 1 && isdown == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "downright");}, 30);
  }
  else if(isleft == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "left");}, 30);
  }
  else if(isright == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "right");}, 30);
  }
  else if(isup == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "up");}, 30);
  }
  else if(isdown == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "down");}, 30);
  }
  else if(isspace == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "attack");}, 30);
  }
  else if(isequip == 1)
  {
    timer = setInterval(function() { sendMove(playerId, "equip");}, 30);
  }
  else
  {
    pressed = 0;
  }

}

//is down variables for directional keys
var isleft = 0;
var isright = 0;
var isup = 0;
var isdown = 0;
var isspace = 0;
var isequip = 0;

$(window).keydown(function(e){
    if(e.keyCode in keymap){
      keymap[e.keyCode] =  true;
      if(document.activeElement.name != "usermsg")
      {
         if([32, 37, 38, 39, 40, 65, 68, 69, 82, 83, 87].indexOf(e.keyCode) > -1)
              {
                e.preventDefault();
              }

              //if up-left are both pressed
              if((keymap[37] || keymap[65]) && (keymap[38] || keymap[87]))
              {
                keypress("upleft");
                isup = 1;
                isleft = 1;
              }

              //if up-right are both pressed
              else if((keymap[39] || keymap[68]) && (keymap[38] || keymap[87]))
              {
                keypress("upright");
                isup = 1;
                isright = 1;
              }

              //if down-left are both pressed
              else if((keymap[37] || keymap[65]) && (keymap[40] || keymap[83]))
              {
                keypress("downleft");
                isdown = 1;
                isleft = 1;
              }

              //if down-right are both pressed
              else if((keymap[39] || keymap[68]) && (keymap[40] || keymap[83]))
              {
                keypress("downright");
                isdown = 1;
                isright = 1;
              }

              //If left arrow key is pressed
              else if(keymap[37] || keymap[65]){
                keypress("left");
                isleft = 1;
              }

              //If up arrow key is pressed
              else if(keymap[38] || keymap[87]){
                keypress("up");
                isup = 1;
              }

              //If right arrow key is pressed
              else if(keymap[39] || keymap[68]){
                keypress("right");
                isright = 1;
              }

              //If down arrow key is pressed
              else if(keymap[40] || keymap[83]){
                keypress("down");
                isdown = 1;
              }

              //if space key is pressed
              else if(keymap[32]){
                keypress("attack");
                isspace = 1;
              }

              //If E key is pressed
              else if(keymap[69]){
                keypress("equip");
                isequip = 1;
              }

              //If R key is pressed
              else if(keymap[82]){
                keypress("respawn");
              }
      }

      //if enter is clicked to submit message
      else if(keymap[13]){
        //sendmessage to server
        chatLog(document.getElementById("usermsg").value);
      }
    }
	});

$(window).keyup(function(e){
    if(e.keyCode in keymap){
      keymap[e.keyCode] = false;
      if(document.activeElement.name != "usermsg")
      {
        if(e.keyCode == 37 || e.keyCode == 65)
        {
          isleft = 0;
        }
        else if(e.keyCode == 38 || e.keyCode == 87)
        {
          isup = 0;
        }
        else if(e.keyCode == 39 || e.keyCode == 68)
        {
          isright = 0;
        }
        else if(e.keyCode == 40 || e.keyCode == 83)
        {
          isdown = 0;
        }
        else if(e.keyCode == 69)
        {
          isequip = 0;
        }
        else if(e.keyCode == 32)
        {
          isspace = 0;
        }
        stopkey();
      }
    }
});

//when player connects send name to server
window.onload = function() {
  sendUser(playerId);
  updateHighscores();

  //update scores in database
  $.post("updateScore.php",
  {
	  user: playerObj[playerId].name,
	  score: playerObj[playerId].score
  });
};
//before window closes send message to server that player is disconnecting
window.addEventListener("beforeunload", function(e){
   sendClose(playerId);
  updateHighscores();

  //update scores in database
  $.post("updateScore.php",
  {
	  user: playerObj[playerId].name,
	  score: playerObj[playerId].score
  });
}, false);
