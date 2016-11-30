/************************************************
*--------modularized projectile methods----------
************************************************/

//require main file objects
var col = require('./collision.js');
var sc = require('./scores.js');

//private module methods
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

//module inclusion declaration for projectiles
module.exports = {
	shootProj: //function that creates and shoots the projectile
		function shootProj(player, projObj, clients) {
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

		    for(var i = 1; i <= 4; i++)
		    {
		    	if(clients[i] != null)
		    	{
		    		clients[i].sendUTF("attack");
		    	}
		    }
		},

	updateProj: //function that updates all of the projectiles
		function updateProj(projObj, playerObj, highScores, clients, obstObj){
		    for(var i = 1; i < 100; i++)
		    {
		        if(projObj[i] != null)
		        {
		            var hit = col.projCol(projObj[i], playerObj, obstObj);

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
		                        sc.setHighScores(playerObj[hit], highScores, clients);
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
		                        sc.setHighScores(playerObj[hit], highScores, clients);
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
		                        sc.setHighScores(playerObj[hit], highScores, clients);
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
		                        sc.setHighScores(playerObj[hit], highScores, clients);
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

		        //send hit audio
		        if(hit <= 5 && hit >= 1)
		        {
		        	for(var a = 1; a <= 4; a++)
		        	{
		        		if(clients[a] != null)
		        		{
		        			clients[a].sendUTF("hit");
		        		}
		        	}
		        }
		    }
		}

}