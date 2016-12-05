/************************************************
*--------modularized collision methods-----------
************************************************/

//require main file objects
var server = require('./server.js');

//module inclusion declaration
module.exports = {
    //player v. wall and player v. obstruction collision detection
    wallCollision: function wallCollision(object, direction, obstObj)
    {
        //player v. player collision
        var hit = 0;
        if(direction == "left")
        {
            if(object.x - 1 <= 9)
            {
                hit = 1;
            }
        }
        else if(direction == "right")
        {
            if(object.x + 50 >= 791)
            {
                hit = 1;
            }
        }
        else if(direction == "up")
        {
            if(object.y - 1 <= 9)
            {
                hit = 1;
            }
        }
        else //direction == down
        {
            if(object.y + 50 >= 591)
            {
                hit = 1;
            }
        }

        //obstruction v. player collision
        for(var i = 1; i <= 15; i++)
        {
            if(obstObj[i] != null)
            {
                if(direction == "left")
                {
                    if(object.x - 1 <= obstObj[i].x + obstObj[i].width - 1
                        && object.x - 1 >= obstObj[i].x)
                    {
                        if(object.y + 25 <= obstObj[i].y + obstObj[i].height - 1
                            && object.y + 25 >= obstObj[i].y)
                        {
                            hit = 1;
                        }
                    }
                }
                else if(direction == "right")
                {
                    if(object.x + 50 >= obstObj[i].x
                        && object.x + 50 <= obstObj[i].x + obstObj[i].width - 1)
                    {
                        if(object.y + 25 <= obstObj[i].y + obstObj[i].height - 1
                            && object.y + 25 >= obstObj[i].y)
                        {
                            hit = 1;
                        }
                    }
                }
                else if(direction == "up")
                {
                    if(object.y - 1 <= obstObj[i].y + obstObj[i].height - 1
                        && object.y - 1 >= obstObj[i].y)
                    {
                        if(object.x + 25 <= obstObj[i].x + obstObj[i].width - 1
                            && object.x + 25 >= obstObj[i].x)
                        {
                            hit = 1;
                        }
                    }
                }
                else //direction == down
                {
                    if(object.y + 50 >= obstObj[i].y
                        && object.y + 50 <= obstObj[i].y + obstObj[i].height - 1)
                    {
                        if(object.x + 25 <= obstObj[i].x + obstObj[i].width - 1
                            && object.x + 25 >= obstObj[i].x)
                        {
                            hit = 1;
                        }
                    }
                }
            }
        }

        return hit;
    },

    //player v. player collision
    playerCollision: function playerCollision(object, direction, playerObj)
        {
            var hit = 0;

            for(var i = 1; i <= 4; i++)
            {
                if(playerObj[i] != null)
                {
                    if(direction == "left")
                    {
                        if(object.x - 1 <= playerObj[i].x + 49
                            && object.x - 1 >= playerObj[i].x)
                        {
                            if(object.y <= playerObj[i].y + 49
                                && object.y >= playerObj[i].y - 48)
                            {
                                if(playerObj[i].health > 0)
                                {
                                    hit = 1;
                                    break;
                                }
                            }
                        }
                    }
                    else if(direction == "right")
                    {
                        if(object.x + 50 >= playerObj[i].x
                            && object.x + 50 <= playerObj[i].x + 49)
                        {
                            if(object.y <= playerObj[i].y + 49
                                && object.y >= playerObj[i].y - 48)
                            {
                                if(playerObj[i].health > 0)
                                {
                                    hit = 1;
                                    break;
                                }
                            }
                        }
                    }
                    else if(direction == "up")
                    {
                        if(object.y - 1 <= playerObj[i].y + 49
                            && object.y - 1 >= playerObj[i].y)
                        {
                            if(object.x <= playerObj[i].x + 49
                                && object.x >= playerObj[i].x - 48)
                            {
                                if(playerObj[i].health > 0)
                                {
                                    hit = 1;
                                    break;
                                }
                            }
                        }
                    }
                    else //direction == down
                    {
                        if(object.y + 50 >= playerObj[i].y
                            && object.y + 50 <= playerObj[i].y + 49)
                        {
                            if(object.x <= playerObj[i].x + 49
                                && object.x >= playerObj[i].x - 48)
                            {
                                if(playerObj[i].health > 0)
                                {
                                    hit = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return hit;
        },

    //projectile v. player collision
    projCol: function projCol(bullet, playerObj, obstObj)
        {
            //-1 is a miss
            //1,2,3,4 are hits on the respective player
            //5 is when it reaches the edge of the arena
            var hit = -1;
            for(var i = 1; i <= 4; i++)
            {
                if(playerObj[i] != null)
                {
                    if(bullet.moving == "left")
                    {
                        if(bullet.x - 5 <= playerObj[i].x + 49
                            && bullet.x - 5 >= playerObj[i].x)
                        {
                            if(bullet.y <= playerObj[i].y + 49
                                && bullet.y >= playerObj[i].y)
                            {
                                if(bullet.launchedBy != i
                                    && playerObj[i].health > 0
                                    && bullet.destroyed == 0)
                                {
                                    hit = i;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }
                        }
                        else if(bullet.x - 5 <= 0)
                        {
                            hit = 5;
                        }
                    }
                    else if(bullet.moving == "right")
                    {
                        if(bullet.x + 5 >= playerObj[i].x
                            && bullet.x + 5 <= playerObj[i].x + 49)
                        {
                            if(bullet.y <= playerObj[i].y + 49
                                && bullet.y >= playerObj[i].y)
                            {
                                if(bullet.launchedBy != i
                                    && playerObj[i].health > 0
                                    && bullet.destroyed == 0)
                                {
                                    hit = i;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }
                        }
                        else if(bullet.x + 5 >= 800)
                        {
                            hit = 5;
                        }
                    }
                    else if(bullet.moving == "up")
                    {
                        if(bullet.x <= playerObj[i].x + 49
                            && bullet.x >= playerObj[i].x)
                        {
                            if(bullet.y - 5 <= playerObj[i].y + 49
                                && bullet.y - 5 >= playerObj[i].y)
                            {
                                if(bullet.launchedBy != i
                                    && playerObj[i].health > 0
                                    && bullet.destroyed == 0)
                                {
                                    hit = i;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }
                        }
                        else if(bullet.y - 5 <= 0)
                        {
                            hit = 5;
                        }
                    }
                    else //bullet.moving is down
                    {
                        if(bullet.x <= playerObj[i].x + 49
                            && bullet.x >= playerObj[i].x)
                        {
                            if(bullet.y + 5 <= playerObj[i].y + 49
                                && bullet.y + 5 >= playerObj[i].y)
                            {
                                if(bullet.launchedBy != i
                                    && playerObj[i].health > 0
                                    && bullet.destroyed == 0)
                                {
                                    hit = i;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }
                        }
                        else if(bullet.y + 5 >= 600)
                        {
                            hit = 5;
                        }
                    }
                }
            }

            if(hit == -1)//check projectile collision with obstructions
            {
                for(var i = 1; i <= 15; i++)
                {
                    if(obstObj[i] != null)
                    {
                        if(bullet.moving == "left")
                        {
                            if(bullet.x - 5 <= obstObj[i].x + obstObj[i].width - 1
                                && bullet.x - 5 >= obstObj[i].x)
                            {
                                if(bullet.y <= obstObj[i].y + obstObj[i].height - 1
                                    && bullet.y >= obstObj[i].y)
                                {
                                    hit = 5;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }
                        }
                        else if(bullet.moving == "right")
                        {
                            if(bullet.x + 5 <= obstObj[i].x + obstObj[i].width - 1
                                && bullet.x + 5 >= obstObj[i].x)
                            {
                                if(bullet.y <= obstObj[i].y + obstObj[i].height - 1
                                    && bullet.y >= obstObj[i].y)
                                {
                                    hit = 5;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }
                        }
                        else if(bullet.moveing == "up")
                        {
                            if(bullet.x <= obstObj[i].x + obstObj[i].width - 1
                                && bullet.x >= obstObj[i].x)
                            {
                                if(bullet.y - 5 <= obstObj[i].y + obstObj[i].height - 1
                                    && bullet.y - 5 >= obstObj[i].y)
                                {
                                    hit = 5;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }

                        }
                        else//bullet.moving is down
                        {
                            if(bullet.x <= obstObj[i].x + obstObj[i].width - 1
                                && bullet.x >= obstObj[i].x)
                            {
                                if(bullet.y + 5 <= obstObj[i].y + obstObj[i].height - 1
                                    && bullet.y + 5 >= obstObj[i].y)
                                {
                                    hit = 5;
                                    bullet.destroyed = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return hit;
        },

    //item v. player collision detection
    itemCollision: function itemCollision(object, itemObj){
        var hitItem = 0;
        var playerX = object.x;
        var playerY = object.y;

          for(var i = 1; i <= 11; i++)
          {
            if(itemObj[i] != null)
            {
              if(playerX + 25 >= itemObj[i].x && playerX + 25 <= itemObj[i].x + itemObj[i].width){
                if(playerY + 25 >= itemObj[i].y && playerY + 25 <= itemObj[i].y + itemObj[i].height){
                  hitItem = i;
                  break;
                }
              }
            }
          }
          return hitItem;
    }
  }
