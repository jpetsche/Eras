var gameInterface;
var gameCtx;
$(window).ready(function(){
	gameInterface = $('#projectiles')[0];
	gameCtx = gameInterface.getContext('2d');
	$('#gameInterface').mouseover(function(){
		document.body.style.cursor ="url('images/teleport.png'), auto";
	});
	$('#gameInterface').mouseout(function(){
		document.body.style.cursor = 'auto';
	});
});
