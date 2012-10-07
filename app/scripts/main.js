
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    title = 'Debt Laboratory';
    
    
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
    
function drawTitle(txt) {
     var TEXT_X = canvas.width/2,
         TEXT_Y = 45;
     context.textAlign = 'center';
     context.textBaseLine = 'middle';
     context.font = '48px Palantino';
     // shadowOn(context);
     context.strokeStyle = 'cornflowerblue';
     context.fillStyle = 'green';
     context.fillText (txt, TEXT_X, TEXT_Y);
     context.strokeText(txt, TEXT_X, TEXT_Y);
     shadowOff(context);
}
    
    
    
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTitle(title);
}

draw();

