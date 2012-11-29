/**
 * TODO: UI
 *   1) Sprite sheets for up and down errors.
 *   2) Trend Indicators working
 *   3) Sprite sheet for payback indicator
 *   4) Payback indicator
 *  
 *   
 *   
 *   9) updateParameters
 *  10) updateUI
 *  11)
 *  12) Button click events
 * 
 * DONE:
 *   5) Deposited with Lender Box
 *   6) Years per Minute controls 
 *   7) Auto buttons working
 *   8) Enter key restarts simulator
 *  
 * 
 * TODO: Simulation
 *   1)
 * 
 * 
 * 
 */




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
     this.DEBUG = false;
     
    /**
     * Date display
     */
    
    this.title = 'Debt Laboratory';
    this.lastTime = 0;
    this.lastCount = 0;
    this.tplTime = _.template("<%= m %>-<%= d %>-<%= y %>");
    this.tplFps = _.template("fps:<%= fps %>");
    this.interval = 50;
    
    // TODO: this will be used for running simulation in larger chunks of days 
    // to avoid very small time slices
    this.multiplier = 1;  
                          
  
    
    
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
        if (this.lastCount > this.interval) {
           this.debtLab.stepSimulation();
           this.updateUI();
           this.lastCount = 0;
        }
        this.updateUI();
    }
    
 
};




SimulatorApp.prototype.init = function () {
    this.debtLab = new DebtLabBasic();
    this.initUI();
    this.debtLab.initClock(new Date(2012, 0, 1));
    this.updateUI();
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(this);
};

SimulatorApp.prototype.pauseSimulator = function (that) {
    if (that.running) {
        that.domButtonStart.value = 'Go';
        that.running = false;
    }
};

SimulatorApp.prototype.startSimulator = function (that) {
    if (that.running === false) {
        that.updateParameters();
        that.domButtonStart.value = 'Pause';
        that.running = true;
    }
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
    
    this.interval = (60000 / (365 * this.debtLab.getYearsPerMinute()));
    
    this.domDisplayMainTime = document.getElementById('main-time');
    
    this.domDisplayFps = document.getElementById('fps-display');
    if (this.DEBUG) {
        this.domDisplayFps.style.visibity = "hidden";
    }
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
    
    // Setup Arrows

    this.upMoneySupply = new createjs.BitmapAnimation(
        new createjs.SpriteSheet({
            "animations": {"disabled": [0], "greenup": [1,6], "yellowup": [7,12], "redup": [13, 18]}, 
            "images": ["app/img/up-sprite-small.png"],
            "frames": {"regX": 0, "height": 52, "count": 19, "regY": 0, "width": 32}
        })
    );
    
    this.stage.addChild(this.upMoneySupply);
    this.upMoneySupply.gotoAndStop("disabled");
        
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
    this.drawSpendBox();
    this.drawTaxBox();
    this.drawAddToLenderAccount();
    this.drawLenderAccount();
    this.drawPaybackBox();
    this.drawLenderDeposits();
    this.drawYearsPerMinute();
   
    
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
     auto.id = "submitAutoCreatePublicMoney";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#EEEEEE";
     auto.onclick = function(e) {
         that.debtLab.setAutoCreatePublicMoneyFlag(!that.debtLab.getAutoCreatePublicMoneyFlag());
         that.updateUI();
     };
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domAutoCreatePublicMoney = auto;
     
     
     
     
     
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
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
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
     this.domAutoCreatePublicMoney.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoCreatePublicMoney.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
      
      
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
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domInputMoneySupplyTarget = input;
    
     
     
    var auto = document.createElement("input");
     auto.id = "submitAutoGrowTargetMoneySupply";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#EEEEEE";
     auto.onclick = function(e) {
         that.debtLab.setAutoTargetMoneySupplyGrow(!that.debtLab.getAutoTargetMoneySupplyGrow());
         that.updateUI();
     };
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
    
    input2.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
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
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domInputMoneySupply = input;
    
     
          
     var c = this.boxMoneySupply = new createjs.Container();
     
     this.upMoneySupply.x = 20;
     this.upMoneySupply.y = 40;
     
     
     c.addChild(s);
     c.addChild(t);
     c.addChild(this.upMoneySupply);
     this.upMoneySupply.gotoAndStop("disabled");
     
     
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
     
     
};


SimulatorApp.prototype.drawPaybackBox = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#5E555D");
     
     
     g.moveTo(0,0);
     g.lineTo(190, 0);
     g.lineTo(210, 50);
     g.lineTo(190, 100);
     g.lineTo(0, 100);
     g.closePath();
        
     
     var s = new createjs.Shape(g);
     
         
     
     var button1 = document.createElement("input");
     button1.id = "submitDefault";
     button1.type = "button";
     button1.value = "Default On Payback";
     button1.style.width = 160 + 'px';
     button1.style.height = 40 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#FF0000";
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitDefault = button1;
     
     
    
     
     var c = this.boxPayback = new createjs.Container();
     c.addChild(s);
    
     c.x = 405;
     c.y = 168;
     this.stage.addChild(c);
     
     
      
     pt = this.boxPayback.localToGlobal(18, 8);
     this.domSubmitDefault.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitDefault.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
     this.stage.update();
     
     
};




SimulatorApp.prototype.drawBorrowBox = function() {
     var g = new createjs.Graphics();
     var that = this;
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
     
     var button1 = document.createElement("input");
     button1.id = "submitBorrow";
     button1.type = "button";
     button1.value = "Borrow";
     button1.style.width = 160 + 'px';
     button1.style.height = 40 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#FF0000";
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitBorrow = button1;
     
     
     var auto = document.createElement("input");
     auto.id = "submitAutoBorrow";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#00FF00";
     auto.onclick = function(e) {
         that.debtLab.setAutoBorrowFlag(!that.debtLab.getAutoBorrowFlag());
         that.updateUI();
     };
    
        
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domSubmitAutoBorrow = auto;
     
     
   
   
     
     
    var input2 = document.createElement("input");
    input2.id = "editAutoBorrowAmount";
    input2.value = "$ 100";
    input2.style.width = 50 + 'px';
    input2.style.position = "absolute";
    input2.style.fontSize = 12 + "px";
    input2.style.fontWeight = "bold";
    input2.style.textAlign = 'center';
    input2.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    input2.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input2);
    this.domAutoBorrowAmount = input2;
     
     
    var input = document.createElement("input");
    input.id = "editAutoBorrowPercent";
    input.value = "5 %";
    input.style.width = 34 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 12 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domAutoBorrowPercent = input; 
     
     
     
     var c = this.boxBorrow = new createjs.Container();
     c.addChild(s);
     c.x = 385;
     c.y = 272;
     this.stage.addChild(c);
     
     
     var pt = this.boxBorrow.localToGlobal(144, 60);
     this.domSubmitAutoBorrow.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitAutoBorrow.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
      
      
     pt = this.boxBorrow.localToGlobal(36, 10);
     this.domSubmitBorrow.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitBorrow.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
     pt = this.boxBorrow.localToGlobal(30, 60);
     this.domAutoBorrowAmount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoBorrowAmount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     pt = this.boxBorrow.localToGlobal(94, 60);
     this.domAutoBorrowPercent.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoBorrowPercent.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     this.stage.update();
     
     
};

SimulatorApp.prototype.drawSpendBox = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#F2DEA0");
     
     g.moveTo(0,50);
     g.lineTo(20,0);
     g.lineTo(210,0);
     g.lineTo(210,100);
     g.lineTo(20,100);
     g.closePath();
        
     
     var s = new createjs.Shape(g);
     
         
     
     var button1 = document.createElement("input");
     button1.id = "submitSpend";
     button1.type = "button";
     button1.value = "Lender Spends";
     button1.style.width = 160 + 'px';
     button1.style.height = 40 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#FF0000";
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitSpend = button1;
     
     
     var auto = document.createElement("input");
     auto.id = "submitAutoSpend";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#EEEEEE";
     auto.onclick = function(e) {
         that.debtLab.setAutoLenderSpendFlag(!that.debtLab.getAutoLenderSpendFlag());
         that.updateUI();
     };
    
 
     
     
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domSubmitAutoSpend = auto;
     
     
     
     
    
     
     
    var input = document.createElement("input");
    input.id = "editAutoSpendPercent";
    input.value = "5 %";
    input.style.width = 34 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 12 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domAutoSpendPercent = input; 
     
     
     
     var t1 = new createjs.Text("OF LAST" , "bold 12px Arial", "#000");
     t1.x = 105;
     t1.y = 50;
     t1.textAlign = "center";
     var t2 = new createjs.Text("INTEREST", "bold 12px Arial", "#000");
     t2.x = 105;
     t2.y = 64;
     t2.textAlign = "center";
     
     var t3 = new createjs.Text("PAYMENT", "bold 12px Arial", "#000");
     t3.x = 105;
     t3.y = 78;
     t3.textAlign = "center";
     
     var c = this.boxSpend = new createjs.Container();
     c.addChild(s);
     c.addChild(t1);
     c.addChild(t2);
     c.addChild(t3);
     c.x = 385;
     c.y = 376;
     this.stage.addChild(c);
     
     
     var pt = this.boxSpend.localToGlobal(144, 60);
     this.domSubmitAutoSpend.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitAutoSpend.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
      
      
     pt = this.boxSpend.localToGlobal(36, 10);
     this.domSubmitSpend.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitSpend.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
    
    
     pt = this.boxSpend.localToGlobal(32, 60);
     this.domAutoSpendPercent.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoSpendPercent.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     this.stage.update();
     
     
};

SimulatorApp.prototype.drawTaxBox = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#D9E835");
     
     g.moveTo(0,50);
     g.lineTo(20,0);
     g.lineTo(210,0);
     g.lineTo(210,100);
     g.lineTo(20,100);
     g.closePath();
        
     
     var s = new createjs.Shape(g);
     
         
     
     var button1 = document.createElement("input");
     button1.id = "submitTax";
     button1.type = "button";
     button1.value = "Tax Lender";
     button1.style.width = 160 + 'px';
     button1.style.height = 40 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#FF0000";
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitTax = button1;
     
     
     var auto = document.createElement("input");
     auto.id = "submitAutoTax";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#EEEEEE";
     auto.onclick = function(e) {
         that.debtLab.setAutoTaxLenderFlag(!that.debtLab.getAutoTaxLenderFlag());
         that.updateUI();
     };
    
     
    
    
     
     
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domSubmitAutoTax = auto;
     
     
     
     
    
     
     
    var input = document.createElement("input");
    input.id = "editAutoTaxPercent";
    input.value = "5 %";
    input.style.width = 34 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 12 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domAutoTaxPercent = input; 
     
     
     
     var t1 = new createjs.Text("OF LAST" , "bold 12px Arial", "#000");
     t1.x = 105;
     t1.y = 50;
     t1.textAlign = "center";
     var t2 = new createjs.Text("INTEREST", "bold 12px Arial", "#000");
     t2.x = 105;
     t2.y = 64;
     t2.textAlign = "center";
     
     var t3 = new createjs.Text("PAYMENT", "bold 12px Arial", "#000");
     t3.x = 105;
     t3.y = 78;
     t3.textAlign = "center";
     
     var c = this.boxTax = new createjs.Container();
     c.addChild(s);
     c.addChild(t1);
     c.addChild(t2);
     c.addChild(t3);
     c.x = 385;
     c.y = 480;
     this.stage.addChild(c);
     
     
     var pt = this.boxTax.localToGlobal(144, 60);
     this.domSubmitAutoTax.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitAutoTax.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
      
      
     pt = this.boxTax.localToGlobal(36, 10);
     this.domSubmitTax.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitTax.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
    
    
     pt = this.boxTax.localToGlobal(32, 60);
     this.domAutoTaxPercent.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoTaxPercent.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     this.stage.update();
     
     
};


SimulatorApp.prototype.drawYearsPerMinute = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#D5F09E");
     g.drawRoundRect(0, 0, 200, 90, 5);
     var s = new createjs.Shape(g);
     var t = new createjs.Text("Years Per Minute", "bold 16px Arial", "#FFF");
     t.x = 100;
     t.y = 10;
     t.textAlign = "center";
     
    var input = document.createElement("input");
    input.id = "editYearsPerMinute";
    input.value = "2";
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
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domInputYearsPerMinute = input;
    
     
          
     var c = this.boxLenderAccount = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
         
     
     c.x = 715;
     c.y = 90;
     this.stage.addChild(c);
     var pt = this.boxLenderAccount.localToGlobal(66, 40);
     this.domInputYearsPerMinute.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domInputYearsPerMinute.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}



SimulatorApp.prototype.drawAddToLenderAccount = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#D1A930");
     g.drawRoundRect(0, 0, 220, 90, 5);
     var s = new createjs.Shape(g);
     
     
     
     var button1 = document.createElement("input");
     button1.id = "submitCreatePublicMoneyAmount";
     button1.type = "button";
     button1.value = "Add To Lender Account";
     button1.style.width = 180 + 'px';
     button1.style.height = 36 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#FF0000";
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitAddMoneyToLenderAccount = button1;
     
     
     var auto = document.createElement("input");
     auto.id = "submitAutoAddMoneyToLenderAccount";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#EEEEEE";
     auto.onclick = function(e) {
         that.debtLab.setAutoAddToLenderAccountFlag(!that.debtLab.getAutoAddToLenderAccountFlag());
         that.updateUI();
     };
     
    
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domAutoAddMoneyToLenderAccount = auto;
     
     
     
     
    var input = document.createElement("input");
    input.id = "editAddMoneyToLenderAccountAmount";
    input.value = "$ 100";
    input.style.width = 80 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 16 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domAddMoneyToLenderAccountAmount = input;
    
     
          
     var c = this.boxAddMoneyToLenderAccount = new createjs.Container();
     c.addChild(s);
    // c.addChild(t);
         
     
     c.x = 715;
     c.y = 210;
     this.stage.addChild(c);
     
      
     var pt = this.boxAddMoneyToLenderAccount.localToGlobal(130, 52);
     this.domAutoAddMoneyToLenderAccount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoAddMoneyToLenderAccount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
      
      
     pt = this.boxAddMoneyToLenderAccount.localToGlobal(22, 6);
     this.domSubmitAddMoneyToLenderAccount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitAddMoneyToLenderAccount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
     pt = this.boxAddMoneyToLenderAccount.localToGlobal(26, 50);
     this.domAddMoneyToLenderAccountAmount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAddMoneyToLenderAccountAmount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}

SimulatorApp.prototype.drawLenderAccount = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#0000FF");
     g.drawRoundRect(0, 0, 240, 120, 5);
     var s = new createjs.Shape(g);
     var t = new createjs.Text("LENDER'S ACCOUNT", "bold 16px Arial", "#FFF");
     t.x = 116;
     t.y = 25;
     t.textAlign = "center";
     
    var input = document.createElement("input");
    input.id = "editLenderAccount";
    input.value = "$ 1,000";
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
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domInputLenderAccount = input;
    
     
          
     var c = this.boxLenderAccount = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
         
     
     c.x = 715;
     c.y = 332;
     this.stage.addChild(c);
     var pt = this.boxLenderAccount.localToGlobal(60, 60);
     this.domInputLenderAccount.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domInputLenderAccount.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
}

SimulatorApp.prototype.drawLenderDeposits = function() {
     var g = new createjs.Graphics();
     var that = this;
     g.setStrokeStyle(1);
     g.beginStroke(createjs.Graphics.getRGB(0,0,0));
     g.beginFill("#E8B407");
     g.drawRoundRect(0, 0, 200, 120, 5);
     var s = new createjs.Shape(g);
     
     
     
     
     var button1 = document.createElement("input");
     button1.id = "submitLendFromDeposits";
     button1.type = "button";
     button1.value = "Lend From Deposits";
     button1.style.width = 160 + 'px';
     button1.style.height = 36 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#FF0000";
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitLendFromDeposits = button1;
     
     
     var auto = document.createElement("input");
     auto.id = "submitAutoLendFromDeposits";
     auto.type = "button";
     auto.value = "Auto Off";
     auto.style.width = 60 + 'px';
     auto.style.height = 26 + 'px';
     auto.style.position = "absolute";
     auto.style.fontSize = 12 + "px";
     auto.style.textAlign = 'center';
     auto.style.backgroundColor = "#EEEEEE";
     auto.onclick = function(e) {
         that.debtLab.setAutoLendFromLenderDepositsFlag(!that.debtLab.getAutoLendFromLenderDepositsFlag());
         that.updateUI();
     };
     
     
     
     
     this.domRootContainer.htmlElement.appendChild(auto);
     this.domAutoLendFromDeposits = auto;
     
     
     
     
    var input = document.createElement("input");
    input.id = "editLendFromDepositsBalance";
    input.value = "$ 10,000";
    input.style.width = 80 + 'px';
    input.style.position = "absolute";
    input.style.fontSize = 16 + "px";
    input.style.fontWeight = "bold";
    input.style.textAlign = 'center';
    input.onclick = function(e) {
        if(that.running) {
          that.pauseSimulator(that);
        }
    };
    input.onkeypress = function(e) {
         var key;
         if(window.event)
              key = window.event.keyCode;     //IE
         else
              key = e.which;     //firefox
        if (key == 13) {
            console.log("Return");
           if(that.running === false) {
              that.startSimulator(that);
           }
        }
    };
    
    this.domRootContainer.htmlElement.appendChild(input);
    this.domLendFromDepositsBalance = input;
    
     
          
     var c = this.boxLenderDeposits = new createjs.Container();
     c.addChild(s);
    
         
     
     var t = new createjs.Text("Deposited", "bold 16px Arial", "#000");
     t.x = 100;
     t.y = 42;
     t.textAlign = "center";
     var t2 = new createjs.Text("With Lender", "bold 16px Arial", "#000");
     t2.x = 100;
     t2.y = 60;
     t2.textAlign = "center";
     c.addChild(t);
     c.addChild(t2);
     
     
     c.x = 715;
     c.y = 472;
     this.stage.addChild(c);
     
      
     var pt = this.boxLenderDeposits.localToGlobal(126, 82);
     this.domAutoLendFromDeposits.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domAutoLendFromDeposits.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px"; 
      
      
     pt = this.boxLenderDeposits.localToGlobal(22, 6);
     this.domSubmitLendFromDeposits.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitLendFromDeposits.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
     pt = this.boxLenderDeposits.localToGlobal(36, 80);
     this.domLendFromDepositsBalance.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domLendFromDepositsBalance.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     
     
     this.stage.update();
     
     
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



SimulatorApp.prototype.updateUI = function () {
    
    var d,m,y;
    var currTime = this.debtLab.getDate();
    d = this.pad(currTime.getDate(), 2, '0');
    m = this.pad((currTime.getMonth() + 1),2, '0');
    y = this.pad(currTime.getFullYear(), 4, '0');
    this.domDisplayMainTime.innerHTML = this.tplTime({m: m, d: d, y: y});
    
    if (this.DEBUG) {
       this.domDisplayFps.innerHTML = this.tplFps({fps:createjs.Ticker.getFPS()});
    }
    if(this.domInputMoneySupply) {
         this.domInputMoneySupply.value = this.debtLab.getMoneySupply();
    }
    
    if (this.domInputYearsPerMinute) {
        this.domInputYearsPerMinute.value = this.debtLab.getYearsPerMinute();
        
    }
    
    this.setAutoButton(this.debtLab.getAutoTargetMoneySupplyGrow(), this.domAutoGrowTargetMoneySupply);
    this.setAutoButton(this.debtLab.getAutoCreatePublicMoneyFlag(), this.domAutoCreatePublicMoney);
    this.setAutoButton(this.debtLab.getAutoBorrowFlag(), this.domSubmitAutoBorrow);
    this.setAutoButton(this.debtLab.getAutoLenderSpendFlag(), this.domSubmitAutoSpend);
    this.setAutoButton(this.debtLab.getAutoTaxLenderFlag(), this.domSubmitAutoTax);
    this.setAutoButton(this.debtLab.getAutoAddToLenderAccountFlag(), this.domAutoAddMoneyToLenderAccount);
    this.setAutoButton(this.debtLab.getAutoLendFromLenderDepositsFlag(), this.domAutoLendFromDeposits);
    
    


     
    
};

SimulatorApp.prototype.setAutoButton = function(flag, button) {
    if (flag) {
       button.value = "Auto On";
       button.style.backgroundColor = "#00FF00";
    } else {
       button.value = "Auto Off";
       button.style.backgroundColor = "#EEEEEE";
    }
};


SimulatorApp.prototype.updateParameters = function() {
    var moneySupply = parseInt(this.domInputMoneySupply.value, 10);
    if(moneySupply > 100 && moneySupply < 1000000) {
       this.debtLab.setMoneySupply(moneySupply);
    }
    
    var yearsPerMinute = parseInt(this.domInputYearsPerMinute.value, 10);
    
    if(yearsPerMinute > 0 && yearsPerMinute < 51) {
       this.debtLab.setYearsPerMinute(yearsPerMinute);
       
    }
    
    this.interval = (60000 / (365 * this.debtLab.getYearsPerMinute()));
};





var app = new SimulatorApp();
app.init();





