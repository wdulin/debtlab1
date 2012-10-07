var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    title = 'Debt Laboratory';
    
window.addEventListener("resize", OnResizeCalled, false);
    
function OnResizeCalled() {
  canvas.style.width = (window.innerWidth - 100) + 'px';
  canvas.style.height = (window.innerHeight - 80) + 'px';
    
}
    
function shadowOn(ctx) {
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 3;
}

function shadowOff(ctx) {
    ctx.shadowColor = undefined;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
}
    
    
function drawBackground() { // Ruled paper
    var STEP_Y = 12,
    TOP_MARGIN = STEP_Y * 4,
    LEFT_MARGIN = STEP_Y * 3,
    i = context.canvas.height;
    // Horizontal lines
    context.strokeStyle = 'lightgray';
    context.lineWidth = 0.5;
    while(i > TOP_MARGIN) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
        i -= STEP_Y;
    }
    // Vertical line
    context.strokeStyle = 'rgba(100,0,0,0.3)';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(LEFT_MARGIN,0);
    context.lineTo(LEFT_MARGIN,context.canvas.height);
    context.stroke();
}       
    
    
function drawTitle(txt) {
     var TEXT_X = canvas.width/2,
         TEXT_Y = 45;
     context.textAlign = 'center';
     context.textBaseLine = 'middle';
     context.font = '48px Palantino';
     shadowOn(context);
     context.strokeStyle = 'black';
     context.fillStyle = 'blue';
     context.fillText (txt, TEXT_X, TEXT_Y);
     context.strokeText(txt, TEXT_X, TEXT_Y);
     shadowOff(context);
}
    
    
    
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTitle(title);
}

OnResizeCalled();

draw();

