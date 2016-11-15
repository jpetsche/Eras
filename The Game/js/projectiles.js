var projectiles;
var projCxt;
var proj = {};
$(window).ready(function(){
	projectiles = $('#projectiles')[0];
	projCtx = projectiles.getContext('2d');
	var fireball = new Image();
	fireball.src = "images/fireball.png";
	proj.x;
	proj.y;
	function fireBall(){
	projCtx.clearRect(0,0,320,320);
	projCtx.drawImage(fireball,proj.x,proj.y);
}
/*$('#gameInterface').click(function(e){
	proj.x = e.pageX - this.offsetLeft + 4;
	proj.y = e.pageY - this.offsetTop + 4;
	fireBall();
});*/
	
});
