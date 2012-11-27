




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
    
    

function SimulatorApp() {
     /**
     * Simulator running
     */
     this.running = false;
     this.RESIZABLE = false;
     
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
        this.updateUI();
    }
    
 
};

SimulatorApp.prototype.updateUI = function () {
    
    var d,m,y;
    var currTime = this.debtLab.getDate();
    d = this.pad(currTime.getDate(), 2, '0');
    m = this.pad((currTime.getMonth() + 1),2, '0');
    y = this.pad(currTime.getFullYear(), 4, '0');
    this.domDisplayMainTime.innerHTML = this.tplTime({m: m, d: d, y: y});
    
    this.domDisplayFps.innerHTML = this.tplFps({fps:createjs.Ticker.getFPS()});
    if(this.domInputMoneySupply) {
         this.domInputMoneySupply.value = this.debtLab.getMoneySupply();
    }
};


SimulatorApp.prototype.init = function () {
    this.debtLab = new DebtLabBasic();
    this.initUI();
    this.debtLab.initClock(new Date(2012, 0, 1));
    this.updateUI();
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addListener(this);
};

SimulatorApp.prototype.pauseSimulator = function (that) {
    if (that.running) {
        that.domButtonStart.value = 'Go';
        that.running = false;
    }
}


/**
 * Map DOM elements to variables
 */
SimulatorApp.prototype.initUI = function() {
    var that = this;
    this.domButtonStart = document.getElementById('start-button');
    this.domButtonStart.onclick = function(e) {
        that.running = that.running ? false : true;
        if (that.running) {
           that.updateParameters();
           that.domButtonStart.value = 'Pause';
        } else {
           that.domButtonStart.value = 'Go';
        }
    };
    
            
    this.domButtonReset = document.getElementById('reset-button');
    this.domButtonReset.onclick = function(e) {
       that.debtLab.doResetToDefaults();
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
        if (that.RESIZABLE) {
           that.mainCanvas.style.width = (window.innerWidth - 100) + 'px';
           that.mainCanvas.style.height = (window.innerHeight - 80) + 'px';
           that.positionDOM(that);
        }
    };
    window.addEventListener("resize", resizeFunction, false);
    resizeFunction();   
        
    this.mainContext.clearRect(0, 0, this.mainContext.canvas.width, this.mainContext.canvas.height);
    
    //drawBackground(this.mainContext);
    //drawTitle(this.mainContext, this.title);
    this.drawRuledBackground();
    this.drawTitle();
     
   
    
    
    this.domRootContainer = new createjs.DOMElement(document.getElementById("container"));
    this.stage.addChild(this.domRootContainer);
    
    this.drawCreatePublicMoney();
    this.drawMoneySupplyTarget();
    this.drawMoneySupply();
    this.drawInterestPaid();
    this.drawDebtToLender();
    this.drawBorrowBox();
   
    
};


SimulatorApp.prototype.drawCreatePublicMoney = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#F5870A");
     g.drawRoundRect(0, 0, 200, 90, 5);
     var s = new createjs.Shape(g);
     
     // var t = new createjs.Text("Create Public Money", "bold 16px Arial", "#000");
     // t.x = 100;
     // t.y = 4;
     // t.textAlign = "center";
     
     
     var button1 = document.createElement("input");
     button1.id = "submitCreatePublicMoneyAmount";
     button1.type = "button";
     button1.value = "Create Public Money";
     button1.style.width = 160 + 'px';
     button1.style.height = 36 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#FF0000";
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitCreatePublicMoneyAmount = button1;
     
     
     var auto = document.createElement("input");
     auto.id = "submitCreatePublicMoneyAmount";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#00FF00";
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domAutoCreatePublicMoneyAmount = auto;
     
     
     
     
    var input = document.createElement("input");
    input.id = "editCreatePublicMoneyAmount";
    input.value = "$ 100";
    input.style.width = 60 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 16 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domCreatePublicMoneyAmount = input;
    
     
          
     var c = this.boxCreatePublicMoney = new createjs.Container();
     c.addChild(s);
    // c.addChild(t);
         
     
     c.x = 55;
     c.y = 110;
     this.stage.addChild(c);
     
      
     var pt = this.boxCreatePublicMoney.localToGlobal(120, 52);
     this.domAutoCreatePublicMoneyAmount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoCreatePublicMoneyAmount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
      
      
     pt = this.boxCreatePublicMoney.localToGlobal(22, 6);
     this.domSubmitCreatePublicMoneyAmount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitCreatePublicMoneyAmount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
     pt = this.boxCreatePublicMoney.localToGlobal(36, 50);
     this.domCreatePublicMoneyAmount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domCreatePublicMoneyAmount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}




SimulatorApp.prototype.drawMoneySupplyTarget = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#0000FF");
     g.drawRoundRect(0, 0, 200, 120, 5);
     var s = new createjs.Shape(g);
     var t = new createjs.Text("Money Supply Target", "bold 16px Arial", "#000");
     t.x = 100;
     t.y = 4;
     t.textAlign = "center";
     
     var t2 = new createjs.Text("Growth Rate", "bold 12px Arial", "#000");
     t2.x = 100;
     t2.y = 60;
     t2.textAlign = "center";
     
    var input = document.createElement("input");
    input.id = "editMoneySupplyTarget";
    input.value = "$ 10,000";
    input.style.width = 110 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 16 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domInputMoneySupplyTarget = input;
    
     
     
    var auto = document.createElement("input");
     auto.id = "submitCreatePublicMoneyAmount";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#00FF00";
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domAutoGrowTargetMoneySupply = auto;
     
     
     
     
    var input2 = document.createElement("input");
    input2.id = "editTargetMoneySupplyGrowthRate";
    input2.value = "5%/year";
    input2.style.width = 60 + 'px';
    input2.style.position = "absolute";
    input2.style.fontSize = 12 + "px";
    input2.style.fontWeight = "bold";
    input2.style.textAlign = 'center';
    input2.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input2);
    this.domTargetMoneySupplyGrowthRate = input2; 
     
     
     
          
     var c = this.boxMoneySupplyTarget = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
     c.addChild(t2);
         
     
     c.x = 55;
     c.y = 210;
     this.stage.addChild(c);
     var pt = this.boxMoneySupplyTarget.localToGlobal(46, 30);
     this.domInputMoneySupplyTarget.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domInputMoneySupplyTarget.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
    
     pt = this.boxMoneySupplyTarget.localToGlobal(120, 82);
     this.domAutoGrowTargetMoneySupply.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoGrowTargetMoneySupply.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
    
     
     pt = this.boxMoneySupplyTarget.localToGlobal(36, 80);
     this.domTargetMoneySupplyGrowthRate.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domTargetMoneySupplyGrowthRate.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
    
    
     
     
     this.stage.update();
     
     
}



SimulatorApp.prototype.drawMoneySupply = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#460E56");
     g.drawRoundRect(0, 0, 200, 120, 5);
     var s = new createjs.Shape(g);
     var t = new createjs.Text("Money Supply", "bold 16px Arial", "#FFF");
     t.x = 116;
     t.y = 25;
     t.textAlign = "center";
     
    var input = document.createElement("input");
    input.id = "editMoneySupply";
    input.value = "$ 10,000";
    input.style.width = 110 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 16 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domInputMoneySupply = input;
    
     
          
     var c = this.boxMoneySupply = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
         
     
     c.x = 55;
     c.y = 342;
     this.stage.addChild(c);
     var pt = this.boxMoneySupply.localToGlobal(60, 60);
     this.domInputMoneySupply.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domInputMoneySupply.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}


SimulatorApp.prototype.drawInterestPaid = function() {
     var g = new createjs.Graphics();
        g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#F562E9");
     g.drawRoundRect(0, 0, 200, 90, 5);
     var s = new createjs.Shape(g);
     var t = new createjs.Text("Interest Paid", "bold 16px Arial", "#000");
     t.x = 116;
     t.y = 25;
     t.textAlign = "center";
     
    var div = document.createElement("div");
    div.id = "showInterestPaid";
    div.innerHTML = "$ 00.00";
    div.style.width = 110 + 'px';
    div.style.position = "absolute";
    div.style.fontSize = 16 + "px";
    div.style.fontWeight = "bold";
    div.style.textAlign = 'center';
    
    
    this.domRootContainer.htmlElement.appendChild(div);
    this.domShowInterestPaid = div;
    
     
          
     var c = this.boxShowInterest = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
         
     
     c.x = 55;
     c.y = 472;
     this.stage.addChild(c);
     var pt = this.boxShowInterest.localToGlobal(60, 60);
     this.domShowInterestPaid.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domShowInterestPaid.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}

SimulatorApp.prototype.drawDebtToLender = function() {
     var g = new createjs.Graphics();
        g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#F562E9");
     g.drawRoundRect(0, 0, 200, 90, 5);
     var s = new createjs.Shape(g);
     var t = new createjs.Text("Debt To Lender", "bold 16px Arial", "#000");
     t.x = 116;
     t.y = 25;
     t.textAlign = "center";
     
    var div = document.createElement("div");
    div.id = "showShowDebtToLender";
    div.innerHTML = "$ 00.00";
    div.style.width = 110 + 'px';
    div.style.position = "absolute";
    div.style.fontSize = 16 + "px";
    div.style.fontWeight = "bold";
    div.style.textAlign = 'center';
    
    
    this.domRootContainer.htmlElement.appendChild(div);
    this.domShowDebtToLender = div;
    
     
          
     var c = this.boxShowDebtToLender = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
         
     
     c.x = 55;
     c.y = 572;
     this.stage.addChild(c);
     var pt = this.boxShowDebtToLender.localToGlobal(60, 60);
     this.domShowDebtToLender.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domShowDebtToLender.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}

SimulatorApp.prototype.drawBorrowBox = function() {
     var g = new createjs.Graphics();
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#62B3F5");
     
     g.moveTo(0,50);
     g.lineTo(20,0);
     g.lineTo(210,0);
     g.lineTo(210,100);
     g.lineTo(20,100);
     g.closePath();
        
     
     var s = new createjs.Shape(g);
     
     var c = this.boxShowDebtToLender = new createjs.Container();
     c.addChild(s);
     c.x = 385;
     c.y = 272;
     this.stage.addChild(c);
     
     
     // var pt = this.boxBorrowBox.localToGlobal(60, 60);
     // this.domShowDebtToLender.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     // this.domShowDebtToLender.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}


SimulatorApp.prototype.updateParameters = function() {
    var moneySupply = parseInt(this.domInputMoneySupply.value);
    if(moneySupply > 100 && moneySupply < 1000000) {
       this.debtLab.setMoneySupply(moneySupply);
    }
}


SimulatorApp.prototype.positionDOM = function (that) {
     if(that.boxMoneySupply) {
        var pt = that.boxMoneySupply.localToGlobal(105, 150);
        that.domInputMoneySupply.htmlElement.style.left = Math.round(pt.x + that.mainCanvas.offsetLeft) + "px";
        that.domInputMoneySupply.htmlElement.style.top = Math.round(pt.y + that.mainCanvas.offsetTop) + "px";
        console.log("positionDOM");
     }
};


SimulatorApp.prototype.drawTitle = function () {
    
    var txt = new createjs.Text(this.title, '48px Palantino', 'blue');
    txt.textAlign = 'center';
    txt.textBaseLine = 'middle';
    txt.x = this.mainCanvas.width/2;
    txt.y = 15;
    txt.shadow = new createjs.Shadow("#000", 3, 3, 8);
    this.stage.addChild(txt);
   
};

SimulatorApp.prototype.drawRuledBackground = function () {
    
    var g = new createjs.Graphics();
    var STEP_Y = 12,
    TOP_MARGIN = STEP_Y * 4,
    LEFT_MARGIN = STEP_Y * 3,
    i = this.mainCanvas.height;
    // Horizontal lines
    g.setStrokeStyle(0.5);
    // ctx.strokeStyle = 'lightgray';
    // ctx.lineWidth = 0.5;
    g.beginStroke('lightgray');
    while(i > TOP_MARGIN) {
        g.moveTo(0, i);
        g.lineTo(this.mainCanvas.width, i);
        // ctx.stroke();
        i -= STEP_Y;
    }
    // Vertical line
    g.setStrokeStyle(1);
    g.beginStroke('rgba(100,0,0,0.3)');
    //ctx.strokeStyle = 'rgba(100,0,0,0.3)';
    //ctx.lineWidth = 1;
    //ctx.beginPath();
    g.moveTo(LEFT_MARGIN,0);
    g.lineTo(LEFT_MARGIN,this.mainCanvas.height);
   // ctx.stroke();
   var bg = new createjs.Shape(g);
   bg.x = 0;
   bg.y = 0;
   this.stage.addChild(bg);
};









var app = new SimulatorApp();
app.init();





