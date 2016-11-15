function canvasLoad(){
	var myCanvas = document.getElementById('background');
	var ctx = myCanvas.getContext('2d');
	var XPos = myCanvas.width / 2;
	var yPosition = myCanvas.height / 2;
	var moveLeft = false;
	var moveUp = false;
	var moveRight = false;
	var moveDown = false;
	var moveSpeed = 4;
	var steper = false;
	var movingL = false;
	var movingU = false;
	var movingR = false;
	var movingD = false;
	var linkWidth = 16;
	var linkHeight = 16;
	var timeTic = 50;
	var counter = 0;
	var teleport = 0;
	var blockRight = false;
	var blockDown = false;
	var blockLeft = false;
	var blockUp = false;
	var projectile = false;
	
	function background(){
		ctx.beginPath();
		ctx.fillStyle = "rgba(0,255,0,1)";
		ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
		ctx.closePath();
	}
	function solidDrawBox(x,y,w,h){
		ctx.beginPath();
		ctx.fillStyle = "rgba(0,0,0,.5)";
		ctx.fillRect(x,y,w,h);
		ctx.closePath();
	}
	function etherealDrawBox(x,y,w,h){
		ctx.beginPath();
		ctx.fillStyle = "rgba(0,0,0,1)";
		ctx.fillRect(x,y,w,h);
		ctx.closePath();
	}
	function drawLink(s){
		underGeography();
		overGeography();
		ctx.beginPath();
		var playerOne = new Image();
		playerOne.src = "linkMoves.png";
		ctx.drawImage(playerOne,s,0,16,16,XPos,yPosition,linkWidth,linkHeight);
		ctx.closePath();
		counter += 1;
		$("#frames").val("frame calc: " + counter);
	}
	// function projectile(){
	// 	ctx.beginPath();
	// 	ctx.fillStyle = "rgba(60,0,0,1)";
	// 	ctx.fillRect(0,0,16,16);
	// 	ctx.closePath();
	// }
	function underGeography(){
	background();
	}
	function overGeography(){
	solidDrawBox(180,160,16,16);
	solidDrawBox(180,180,16,16);
	}
	function initialization(){
	underGeography();
	overGeography();
	}
	initialization();
	$(window).keydown(function(e){
		if (e.keyCode == 37){
			if ((moveLeft==false)&&(moveRight==false)){
				moveLeft = window.setInterval(function(){
					if (blockRight == false){
						XPos -= moveSpeed;
					}
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
		if (e.keyCode == 38){
			if ((moveUp==false)&&(moveDown==false)){
				moveUp = window.setInterval(function(){
					if (blockDown == false){
						yPosition -= moveSpeed;
					}
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
		if (e.keyCode == 39){
			if ((moveLeft==false)&&(moveRight==false)){
				moveRight = window.setInterval(function(){
					if (blockLeft == false){
						XPos += moveSpeed;
					}
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
		if (e.keyCode == 40){
			if ((moveUp==false)&&(moveDown==false)){
				moveDown = window.setInterval(function(){
					if (blockUp == false){
						yPosition += moveSpeed;
					}
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
		if (e.keyCode == 76){
			linkWidth *= 2;
			linkHeight *= 2;
			
		}
		if (e.keyCode == 75){
			linkWidth /= 2;
			linkHeight /= 2;
		}
	});
	$(window).keyup(function(e){
		if (e.keyCode == 37){
			clearInterval(moveLeft);
			moveLeft = false;
			drawLink(0);
			steper = false;
			movingL = false;
		}
		if (e.keyCode == 38){
			clearInterval(moveUp);
			moveUp = false;
			drawLink(32);
			steper = false;
			movingU = false;
		}
		if (e.keyCode == 39){
			clearInterval(moveRight);
			moveRight = false;
			drawLink(64);
			steper = false;
			movingR = false;
		}
		if (e.keyCode == 40){
			clearInterval(moveDown);
			moveDown = false;
			drawLink(96);
			steper = false;
			movingD = false;
		}
	});
	$('#canvas').click(function(e){
		XPos = e.pageX - this.offsetLeft - ((linkWidth)/2);
		yPosition = e.pageY - this.offsetTop - ((linkHeight)/2);
		drawLink(0);
		teleport += 1;
		$('#teleports').val("teleports: " + teleport);
		projectile = window.setInterval(function(){
		});
	});
	$('#canvas').mouseover(function(){
		document.body.style.cursor = "url('linkMoves.png'), auto";
	});
	$('#canvas').mouseout(function(){
		document.body.style.cursor = 'auto';
	});
}