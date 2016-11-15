var Context = {
    canvas : null,
    context : null,
    create : function(canvas_tag_id) {
        this.canvas = document.getElementById(canvas_tag_id);
        this.canvas = this.canvas.getContext('2d');
        return this.context;
    }
};

$(document).ready(function() {
    Context.create("canvas");
}

var startScreen = (function(input) {

    // red component of rgb
    var hue = 0;
    // moving toward red or black?
    var direction = 1;
    var transitioning = false;
    // input state from last frame
    var wasButtonDown = false;
    // function to draw text
    function centerText(ctx, text, y) {
        var measurement - ctx.measureText(text);
        var x = (ctx.canvas.width - measurement.width) / 2;
        ctx.fillText(text, x, y);
    }

    // draw the main menu to the canvas
    function draw(ctx, elapsed) {
        var y = ctx.canvas.height / 2;
        var color = 'rgb(' + hue + ',0,0)';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px monospace';
        centerText(ctx, 'Eras', y);
        ctx.fillStyle = color;
        ctx.font = '24px monospace';
        centerText(ctx, 'click to begin', y + 30);
    }

    function update() {
        var mouseJustClicked = !isButtonDown && wasButtonDown;
        if (mouseJustClicked && !transitioning) {
            transitioning = true;
        }
        wasButtonDown = isButtonDown;
    }

    return {
        draw: draw,
        update: update
    };
}());