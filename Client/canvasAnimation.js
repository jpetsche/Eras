//Curly's animation code, it is here to be saved but removed
//from gamecanvas.js to reduce clutter

/***************************************************************
*-----------------------CANVAS ANIMATION------------------------
***************************************************************/


//For each animation frame, we can update the elements on the canvas, clear the canvas, redraw the canvas, and then request another animation frame
// window.requestAnimFrame = (function(callback) {
//         return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
//         function(callback) {
//           window.setTimeout(callback, 1000 / 60);
//         };
//       })();


//handles animation of the square/s
// function animate(myRectangle, canvas, context, direction, startY, startX) {
// 	  update();
//       var time = (new Date()).getTime()  - start;

//       var linearSpeed = 100;

//   		if(myRectangle.facing == 'left') {
//   			var newX = -1*(linearSpeed * time / 1000) + startX;
//   			newY = myRectangle.y;
//   		}

//   		else if(direction == 'right') {
//   			var newX = (linearSpeed * time / 1000) + startX;
//   			newY = myRectangle.y;
//   		}

//   		else if(direction == 'up') {
//   			var newY = -1*(linearSpeed * time / 1000) + startY;
//   			newX = myRectangle.x;
//   		}

//   		else if(direction == 'down') {
//   			var newY = (linearSpeed * time / 1000) + startY;
//   			newX = myRectangle.x;
//   		}

//   		if((newX < canvas.width - myRectangle.width && newX >= 0)) {
//   			myRectangle.x = newX;
//   			myRectangle.y = newY;
//   		}

//   		// clears old square from screen
//   		context.clearRect(0, 0, canvas.width, canvas.height);
//   		// draws new square in new position
//   		drawRect(myRectangle, context);

//   		requestAnimFrame( function() {
//   			animate(myRectangle, canvas, context, direction, startY, startX)
//   		});
// }