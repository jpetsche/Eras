var character;
var charCtx;
var link = {};
$(window).ready(function(){
	character = $('#character')[0];
	charCtx = character.getContext('2d');
	link.x = character.width/2;
	link.y = character.width/2;
	charImage.onload = function(){
		drawLink(112);
	}
});
var charImage = new Image();
charImage.src = "images/linkMoves.png";
var moveLeft = false;
var moveUp = false;
var moveRight = false;
var moveDown = false;
var movingL = false;
var movingU = false;
var movingR = false;
var movingD = false;
var steper = false;
var mana = 4;
//game integers
var moveSpeed = 4;
var timeTic = 50;
var linkWidth = 16;
var linkHeight = 16;
var teleport = 0;
var counter = 0;
	//define how character is drawn
	function drawLink(s){
		charCtx.clearRect(0,0,320,320);
		charCtx.drawImage(charImage,s,0,16,16,link.x,link.y,linkWidth,linkHeight);
		counter += 1;
		if (counter == 50){
			counter = 0;
			if (mana < 4){
				mana += 1;
				$('#mana').val("mana: " + mana);
			}
		}
		$("#frames").val('frames calc: ' + counter);
	}
	//charImage.onload = function(){
	//	drawLink(112);
	//}
	//pressing the arrow keys
	$(window).keydown(function(e){
		//left key down
		if (e.keyCode == 37){
			if ((moveLeft==false)&&(moveRight==false)){
				moveLeft = window.setInterval(function(){
					link.x -= moveSpeed;
					if ((movingU==false)&&(movingD==false)){
						if(steper == false){
							drawLink(16);
							steper = true;
						}
						else{
							drawLink(0);
							steper = false;
						}
					movingL = true;
					}
				},timeTic);
			}
		}
		//up key down
		if (e.keyCode == 38){
			if ((moveUp==false)&&(moveDown==false)){
				moveUp = window.setInterval(function(){
						link.y -= moveSpeed;
					if ((movingL==false)&&(movingR==false)){
						if(steper == false){
							drawLink(48);
							steper = true;
						}
						else{
							drawLink(32);
							steper = false;
						}
					movingU = true;
					}
				},timeTic);
			}
		}
		//right key down
		if (e.keyCode == 39){
			if ((moveLeft==false)&&(moveRight==false)){
				moveRight = window.setInterval(function(){
					link.x += moveSpeed;
					if ((movingU==false)&&(movingD==false)){
						if(steper == false){
							drawLink(80);
							steper = true;
						}
						else{
							drawLink(64);
							steper = false;
						}
					movingR = true;
					}
				},timeTic);
			}
		}
		//down key down
		if (e.keyCode == 40){
			if ((moveUp==false)&&(moveDown==false)){
				moveDown = window.setInterval(function(){
					link.y += moveSpeed;
					if ((movingL==false)&&(movingR==false)){
						if(steper == false){
							drawLink(96);
							steper = true;
						}
						else{
							drawLink(112);
							steper = false;
						}
					movingD = true;
					}
				},timeTic);
			}
		}
	});
	//key ups
	$(window).keyup(function(e){
		//left key up
		if (e.keyCode == 37){
			clearInterval(moveLeft);
			moveLeft = false;
			drawLink(0);
			steper = false;
			movingL = false;
		}
		//up key up
		if (e.keyCode == 38){
			clearInterval(moveUp);
			moveUp = false;
			drawLink(32);
			steper = false;
			movingU = false;
		}
		//right key up
		if (e.keyCode == 39){
			clearInterval(moveRight);
			moveRight = false;
			drawLink(64);
			steper = false;
			movingR = false;
		}
		//down key up
		if (e.keyCode == 40){
			clearInterval(moveDown);
			moveDown = false;
			drawLink(96);
			steper = false;
			movingD = false;
		}
	});
	// instantaneous position change
	$(window).ready(function(){
	$('#gameInterface').click(function(e){
		if (mana > 0){
			link.x = e.pageX - this.offsetLeft;
			link.y = e.pageY - this.offsetTop;
			drawLink(98);
			teleport += 1;
			mana -= 1;
			$('#teleports').val("teleports: " + teleport);
			$('#mana').val("mana: " + mana);
		}
		
		var clickX = e.pageX - this.offsetLeft;
		var clickY = e.pageY - this.offsetTop;
		$('#PageX').val('PageX: '+ clickX);
		$('#PageY').val('PageY: '+ clickY);
		
	});
	
	
	
	
	
	});