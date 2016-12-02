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
grass.src = "images/grass.png"
var gameover = new Image();//GAME OVER image
gameover.src = "images/gameover.png"

/***************************************************
*-------------------loads sounds--------------------
***************************************************/
var shootfireball = new Audio("audio/shootfireball1.wav");//audio, shoot fireball
var fireballhit = new Audio("audio/fireballhit1.wav");//audio, fireball explodes