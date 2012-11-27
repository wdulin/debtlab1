



    
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
     ctx.fillText(txt, TEXT_X, TEXT_Y);
     ctx.strokeText(txt, TEXT_X, TEXT_Y);
     shadowOff(ctx);
}
    








function SimulatorApp() {
     /**
     * Simulator running
     */
     this.running = false;
     
    /**
     * Date display
     */
    
    this.title = 'Debt Laboratory';
    this.lastTime = 0;
    this.lastCount = 0;
    this.tplTime = _.template("<%= m %>-<%= d %>-<%= y %>");
    this.tplFps = _.template("fps:<%= fps %>");
  
    
    
}


    
   


SimulatorApp.prototype.pad = function (input, length, padding)
{
  while((input = input.toString()).length + (padding = padding.toString()).length < length)
  {
    padding += padding;
  }
  return padding.substr(0, length - input.length) + input;
};    
    


SimulatorApp.prototype.tick = function (timeElapsed) {
    
    //var delta = timeElapsed - this.lastTime;
    this.lastCount += timeElapsed;
   // this.lastTime = timeElapsed;
    // console.log(timeElapsed);
    if (this.running) {
        if (this.lastCount > 50) {
           this.debtLab.stepSimulation();
           this.updateUI();
           this.lastCount = 0;
        }
    }
    this.updateUI();
 
};

SimulatorApp.prototype.updateUI = function () {
    
    var d,m,y;
    var currTime = this.debtLab.getDate();
    d = this.pad(currTime.getDate(), 2, '0');
    m = this.pad((currTime.getMonth() + 1),2, '0');
    y = this.pad(currTime.getFullYear(), 4, '0');
    this.domDisplayMainTime.innerHTML = this.tplTime({m: m, d: d, y: y});
    
    this.domDisplayFps.innerHTML = this.tplFps({fps:createjs.Ticker.getFPS()});
};


SimulatorApp.prototype.init = function () {
    this.debtLab = new DebtLabBasic();
    this.initUI();
    this.debtLab.initClock(new Date(2012, 0, 1));
    this.updateUI();
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addListener(this);
};



/**
 * Map DOM elements to variables
 */
SimulatorApp.prototype.initUI = function() {
    var that = this;
    this.domButtonStart = document.getElementById('start-button');
    this.domButtonStart.onclick = function(e) {
        that.running = that.running ? false : true;
        if (that.running) {
           that.domButtonStart.value = 'Pause';
        } else {
           that.domButtonStart.value = 'Go';
        }
    };
    
            
    this.domButtonReset = document.getElementById('reset-button');
    this.domButtonReset.onclick = function(e) {
       that.debtLab.initClock(new Date(2012, 0 , 1));
       that.updateUI();
    };
    
    this.domDisplayMainTime = document.getElementById('main-time');
    this.domDisplayFps = document.getElementById('fps-display');
    this.mainCanvas = document.getElementById('main-canvas');
    this.mainContext = this.mainCanvas.getContext('2d');
    this.stage = new createjs.Stage(this.mainCanvas);
    
    // Handle canvas resize
    var resizeFunction = function() {
         that.mainCanvas.style.width = (window.innerWidth - 100) + 'px';
         that.mainCanvas.style.height = (window.innerHeight - 80) + 'px';
    };
    window.addEventListener("resize", resizeFunction, false);
    resizeFunction();   
        
    this.mainContext.clearRect(0, 0, this.mainContext.canvas.width, this.mainContext.canvas.height);
     this.drawMoneySupply();
    drawBackground(this.mainContext);
    drawTitle(this.mainContext, this.title);
    
    
   
    
    
};


SimulatorApp.prototype.drawMoneySupply = function() {
     var g = new createjs.Graphics();
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill(createjs.Graphics.getRGB(0,0,230));
     g.drawRoundRect(0, 0, 100, 100, 10);
     var s = new createjs.Shape(g);
     s.x = 100;
     s.y = 100;
     this.stage.addChild(s);
     this.stage.update();
     
     
}


var app = new SimulatorApp();
app.init();





