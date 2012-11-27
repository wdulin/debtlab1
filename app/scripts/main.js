var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    title = 'Debt Laboratory',
    startButton = document.getElementById('start-button'),
    resetButton = document.getElementById('reset-button'),
    timeDisplay = document.getElementById('main-time'),
    fpsDisplay = document.getElementById('fps-display'),
    currTime = new Date(),
    lastTime = 0,
    lastCount = 0,
    tplTime = _.template("<%= m %>-<%= d %>-<%= y %>"),
    tplFps = _.template("fps:<%= fps %>"),
    DAY_MS = 60 * 60 * 1000 * 24,
    running = false;
    
    
function pad(input, length, padding)
{
  while((input = input.toString()).length + (padding = padding.toString()).length < length)
  {
    padding += padding;
  }
  return padding.substr(0, length - input.length) + input;
}    
    
function incDay() {
    var d,m,y;
    currTime = new Date(currTime.getTime() + DAY_MS);
    d = pad(currTime.getDate(), 2, '0');
    m = pad((currTime.getMonth() + 1),2, '0');
    y = pad(currTime.getFullYear(), 4, '0');
    return tplTime({m: m, d: d, y: y});
    
    
}

function updateFps(delta) {
    fpsDisplay.innerHTML = tplFps({fps: _.str.numberFormat(1000 / delta, 2)}); 
}
    
    
function animate(time) {
    var delta = time - lastTime;
    lastCount += delta;
    lastTime = time;
    if (running) {
        if (lastCount > 50) {
         timeDisplay.innerHTML = incDay();
        // fpsDisplay.innerHTML = tplFps({fps: 1000 / delta});
        updateFps(delta);
         lastCount = 0;
        }
    }
    
    window.requestNextAnimationFrame(animate);
}    



startButton.onclick = function(e) {
   running = running ? false : true;
   if (running) {
       startButton.value = 'Pause';
   } else {
       startButton.value = 'Go';
   }
}

resetButton.onclick = function(e) {
   currTime = new Date(2012, 0, 1);
   timeDisplay.innerHTML = incDay();
}
    
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
    
    
function drawBackground(ctx) { // Ruled paper
    var STEP_Y = 12,
    TOP_MARGIN = STEP_Y * 4,
    LEFT_MARGIN = STEP_Y * 3,
    i = ctx.canvas.height;
    // Horizontal lines
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = 0.5;
    while(i > TOP_MARGIN) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
        i -= STEP_Y;
    }
    // Vertical line
    ctx.strokeStyle = 'rgba(100,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(LEFT_MARGIN,0);
    ctx.lineTo(LEFT_MARGIN,ctx.canvas.height);
    ctx.stroke();
}       
    
    
function drawTitle(ctx,txt) {
     var TEXT_X = ctx.canvas.width/2,
         TEXT_Y = 45;
     ctx.textAlign = 'center';
     ctx.textBaseLine = 'middle';
     ctx.font = '48px Palantino';
     shadowOn(ctx);
     ctx.strokeStyle = 'black';
     ctx.fillStyle = 'blue';
     ctx.fillText (txt, TEXT_X, TEXT_Y);
     ctx.strokeText(txt, TEXT_X, TEXT_Y);
     shadowOff(ctx);
}
    
    
    
function draw(ctx) {
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawBackground(ctx);
    drawTitle(ctx, title);
    currTime = new Date(2012, 0, 1);
    timeDisplay.innerHTML = incDay();
}

OnResizeCalled();

draw(context);

window.requestNextAnimationFrame(animate);

