/************************************************
*-----------modularized score methods------------
************************************************/

//module inclusion declaration for high score methods
module.exports = {
	setHighScores: //method that sets highscores
		function setHighScores(person, highScores, clients)
		{
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
}