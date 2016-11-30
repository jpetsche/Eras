/************************************************
*--------modularized chat methods-----------
************************************************/
var mostRecent = 1;

//module inclusion declaration
module.exports = {
	//a new message has been received for the chat log
	update: function updateChatLog(msgObj, chatObj)
		{
			//incremenet what the most used log is
			if(mostRecent < 101)
			{
				mostRecent++;
			}
			else
			{
				mostRecent = 2;
			}

			chatObj[1] = mostRecent;
			chatObj[mostRecent] = msgObj;
		}
}