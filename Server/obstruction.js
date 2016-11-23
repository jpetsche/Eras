/************************************************
*--------modularized obstruction methods---------
************************************************/

//require main file objects
var server = require('./server.js');

//private module methods
//method to create obstruction objects
function obstruction(xc, yc, width, height, type, dir)
{
    this.x = xc;
    this.y = yc;
    this.width = width;
    this.height = height;
    //to determine what image the obstruction will be
    //i.e., rock, tree, wall, water
    this.type = type;
    this.passable = 0;
    this.slow = 0;
    this.direction = dir;
}

//module inclusion declaration for obstructions
module.exports = {
	populateObstructions: //function the populates the map with obstructions
		function populateObstructions(obstObj)
		{
		    //determine how many obstructions will be on the map
		    var amount = Math.floor((Math.random() * 15) + 5);
		    for(var i = 1; i <= amount; i++)
		    {
		        //var type = Math.floor((Math.random() * 6) + 1);
		        var type = 3; //set as boulder, just for testing
		        var dir = 0;
		        var width;
		        var height;
		        if(type == 1)
		        {
		            type = "tree";
		            width = 50;
		            height = 50;
		        }
		        else if(type == 2)
		        {
		            type = "rock";
		            width = 20;
		            height = 20;
		        }
		        else if(type == 3)
		        {
		            type = "boulder";
		            width = 75;
		            height = 75;
		        }
		        else if(type == 4)
		        {
		            type = "water";
		            width = 50;
		            height = 50;
		        }
		        else if(type == 5)
		        {
		            type = "mud";
		            width = 50;
		            height = 50;
		        }
		        else
		        {
		            //pick the direction of the wall
		            dir = Math.floor((Math.random() * 2) + 1);
		            type = "wall";
		            if(dir == 1)
		            {
		                //left to right
		                width = 150;
		                height = 20;
		            }
		            else
		            {
		                //up and down
		                width = 20;
		                height = 150;                
		            }
		        }

		        //create the obstruction, titled thing
		        var xc;
		        var yc;
		        var issue = 0;
		        while(issue != -1)
		        {
		        	issue = 0;
		        	xc = Math.floor((Math.random() * 700) + 50);
		        	for(var a = 1; a <= 15; a++)
		        	{
		        		// if(obstObj[a] != null)
		        		// {
		        		// 	if(xc <= obstObj[a].x + obstObj[a].width
		        		// 		&& xc + width >= obstObj[a].x)
		        		// 	{
		        		// 		if()
		        		// 		issue = 1;
		        		// 	}
		        		// }
		        	}
		        	if(issue == 0)
		        	{
		        		break;
		        	}
		        	//console.log("looping in obst x coord");
		        }

		        while(issue != -1)
		        {
		        	issue = 0;
		        	yc = Math.floor((Math.random() * 500) + 50);
		        	for(var a = 1; a <= 15; a++)
		        	{
		        		// if(obstObj[a] != null)
		        		// {
		        		// 	if(yc <= obstObj[a].y + obstObj[a].height
		        		// 		&& yc + height >= obstObj[a].y)
		        		// 	{
		        		// 		issue = 1;
		        		// 	}
		        		// }
		        	}
		        	if(issue == 0)
		        	{
		        		break;
		        	}
		        	//console.log("looping in obst x coord");
		        }

		        var thing = new obstruction(xc, yc, width, height, type, dir);
		        obstObj[i] = thing;
		    }
		}
}