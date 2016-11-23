

/***************************************************************
*------------------------SETUP CANVAS---------------------------
***************************************************************/

//For each animation frame, we can update the elements on the canvas, clear the canvas, redraw the canvas, and then request another animation frame
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

//holds value of keyDown
var keymap = {32: false, 37: false, 38: false, 39: false, 40: false,
  65: false, 68: false, 82: false, 83: false, 87: false};

var numPlayers = 0;
var playerObj = {};
var playerId = 1;
var projObj = {};
var obstObj = {};

var canvas = document.getElementById("gameBorder");
var ctx = {};
ctx[0] = canvas.getContext("2d");
//var grass = document.getElementById("grass");
var grass = new Image();
grass.src = "images/grass.png"
var gameover = new Image();
gameover.src = "images/gameover.png"
var move = true;
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

//load all images
var walkleft1 = new Image();
walkleft1.src = "images/sprites/walk-left-1.png";
var walkright1 = new Image();
walkright1.src = "images/sprites/walk-right-1.png";
var walkup1 = new Image();
walkup1.src = "images/sprites/walk-up-1.png";
var walkdown1 = new Image();
walkdown1.src = "images/sprites/walk-down-1.png";
var attackleft5 = new Image();
attackleft5.src = "images/sprites/attack-left-5.png";
var attackright5 = new Image();
attackright5.src = "images/sprites/attack-right-5.png";
var attackup5 = new Image();
attackup5.src = "images/sprites/attack-up-5.png";
var attackdown5 = new Image();
attackdown5.src = "images/sprites/attack-down-5.png";
var die6 = new Image();
die6.src = "images/sprites/die-6.png";
var expl = new Image();
expl.src = "images/expl_02_0015.png";
var boulder = new Image();
boulder.src = "images/boulder.png";


/***************************************************************
*-----------------------CANVAS DRAWING--------------------------
***************************************************************/

//draw background
function drawBack(context)
{
  context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  var pat = context.createPattern(grass, "repeat");
  context.rect(0, 0, canvas.width, canvas.height);
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

//draw gameover image
function drawGameOver(context)
{
  //draw the GAMEOVER image
  context.beginPath();
  context.rect(200, 200, 400, 200);
  context.drawImage(gameover, 200, 200);

  //draw your score
  context.beginPath();
  context.rect(300, 350, 200, 100);
  context.font = "18px Georgia";
  context.fillStyle = "red";
  var scoreSt = "Your score was: " + playerObj[playerId].score;
  context.fillText(scoreSt, 300, 350, 200, 100);

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

  //now draw the health bar
  healthBar(rect, context, id);

}

//function for health bar
function healthBar(rect, context, id)
{
  context.beginPath();
  context.rect(rect.x, rect.y - 10, rect.width, 10);
  context.fillStyle = 'red';
  context.fill();
  context.beginPath();
  context.rect(rect.x, rect.y - 10, 10*rect.health, 10);
  context.fillStyle = 'green';
  context.fill();
  context.beginPath();
  context.rect(rect.x, rect.y - 3, 50, 10);
  context.fillStyle = 'white';
  var lifePoints = "         " + rect.health + "/5";
  context.font = "8px Georgia";
  context.fillText(lifePoints, rect.x, rect.y-3, 50, 10);

}

var playerRect = {
  charNum: 0,
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
*-----------------------CANVAS ANIMATION------------------------
***************************************************************/

//handles animation of the square/s
function animate(myRectangle, canvas, context, direction, startY, startX) {
	  update();
      var time = (new Date()).getTime()  - start;

      var linearSpeed = 100;

  		if(myRectangle.facing == 'left') {
  			var newX = -1*(linearSpeed * time / 1000) + startX;
  			newY = myRectangle.y;
  		}

  		else if(direction == 'right') {
  			var newX = (linearSpeed * time / 1000) + startX;
  			newY = myRectangle.y;
  		}

  		else if(direction == 'up') {
  			var newY = -1*(linearSpeed * time / 1000) + startY;
  			newX = myRectangle.x;
  		}

  		else if(direction == 'down') {
  			var newY = (linearSpeed * time / 1000) + startY;
  			newX = myRectangle.x;
  		}

  		if((newX < canvas.width - myRectangle.width && newX >= 0)) {
  			myRectangle.x = newX;
  			myRectangle.y = newY;
  		}

  		// clears old square from screen
  		context.clearRect(0, 0, canvas.width, canvas.height);
  		// draws new square in new position
  		drawRect(myRectangle, context);

  		requestAnimFrame( function() {
  			animate(myRectangle, canvas, context, direction, startY, startX)
  		});
}

/***************************************************************
*------------------UPDATE CANVAS FROM SERVER--------------------
***************************************************************/

function drawFromServer() {
  //clear the previous squares
  //ctx[0].clearRect(0, 0, canvas.width, canvas.height);

  //draw the grass background
  drawBack(ctx[0]);

	//draws the new player in its new position
  for(var i = 1; i <= 4; i++)
  {
    if(playerObj[i] != null)
    {
      var curPlayer = playerObj[i];
      drawRect(curPlayer, ctx[0], playerId);
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

$(window).keydown(function(e){
    if(e.keyCode in keymap){
      keymap[e.keyCode] =  true;

      if([32, 37, 38, 39, 40, 65, 68, 82, 83, 87].indexOf(e.keyCode) > -1)
      {
        e.preventDefault();
      }

      //If left arrow key is pressed
      if(keymap[37] || keymap[65]){
        //send move to server
        sendMove(playerId, "left");
      }

      //If up arrow key is pressed
      if(keymap[38] || keymap[87]){
        //send move to server
        sendMove(playerId, "up");
      }

      //If right arrow key is pressed
      if(keymap[39] || keymap[68]){
        //send move to server
        sendMove(playerId, "right");
      }

      //If down arrow key is pressed
      if(keymap[40] || keymap[83]){
        //send move to server
        sendMove(playerId, "down");
      }

      //if space key is pressed
      else if(keymap[32]){
        //send move to server
        sendMove(playerId, "attack");
      }

      //If R key is pressed
      else if(keymap[82]){
        //send move to server
        sendMove(playerId, "respawn");
      }
    }
	});

$(window).keyup(function(e){
    if(e.keyCode in keymap){
      keymap[e.keyCode] = false;
      move = false;
    }
	});

window.addEventListener("beforeunload", function(e){
   sendClose(playerId);
}, false);
