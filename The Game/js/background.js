var background;
var bgCtx;
$(window).ready(function(){
	background = $('#background')[0];
	bgCtx = background.getContext('2d');
});
var terrain = new Image();
terrain.src = "images/terrain.png";	
function drawBg(){
	bgCtx.drawImage(terrain,0,0,320,320);
}
terrain.onload = function(){
	drawBg();
}