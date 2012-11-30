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
 *  11) Trend indicator fields
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
 *   1) Borrow and Notes 
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
     this.INDICATOR_FLASH_TIME = 500;
     
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
    
    // Flag to indicate if the payback indicator is busy
    this.indicatorBusy = false;
                          
  
    
    
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
    var that = this;
    
    if (this.running) {
        if (this.lastCount > this.interval) {
           this.debtLab.stepSimulation();
           this.updateUI();
           this.lastCount = 0;
        }
        this.updateUI();
        
        
//        async.whilst(
//            that.debtLab.popNotesPayed,
//            that.flashNotePayback
//        );
        
        
        if (!this.indicatorBusy) {
            if(this.debtLab.popNotesPayed()) {
                this.flashNotePayback();
            }
        
            if(this.debtLab.popNotesDefaulted()) {
                this.flashNoteDefault();
            }
        }
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

/**
 * Setup the Public Money Box for the UI.
 */
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
     
     // Command for doCreatePublicMoney()
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
     button1.onclick = function(e) {
         that.debtLab.doCreatePublicMoney();
         that.updateUI();
     };
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitCreatePublicMoneyAmount = button1;
     
     // Command for setting Auto Create Public Money
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



/**
 * Setup the Target Money Supply Box for the UI.
 */
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


/**
 * Setup the Money Supply Box for the UI.
 */
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
    
    
    // Create a div for displaying trend indicator
    var div1 = document.createElement("div");
    div1.id = "displayMoneySupplyTrend";
    div1.innerHTML = "0.0%";
    div1.style.width = 30 + 'px';
    div1.style.position = "absolute";
    div1.style.fontSize = 12 + "px";
    div1.style.textAlign = 'center';
    div1.style.backgroundColor = "#aaaaaa"
    this.domRootContainer.htmlElement.appendChild(div1);
    this.domMoneySupplyTrend = div1;
    
     
          
     var c = this.boxMoneySupply = new createjs.Container();
     
     this.upMoneySupply.x = 60;
     this.upMoneySupply.y = 60;
     
     
     c.addChild(s);
     c.addChild(t);
     c.addChild(this.upMoneySupply);
     // this.upMoneySupply.gotoAndStop("disabled");
     
     
     c.x = 55;
     c.y = 342;
     this.stage.addChild(c);
     
     
     var pt = this.boxMoneySupply.localToGlobal(60, 60);
     this.domInputMoneySupply.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domInputMoneySupply.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     pt = this.boxMoneySupply.localToGlobal(10, 50);
     this.domMoneySupplyTrend.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domMoneySupplyTrend.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     this.stage.update();
     
     
}

/**
 * Setup the Interest Paid Box for the UI.
 */
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
    
    // Create a div for displaying trend indicator
    var div1 = document.createElement("div");
    div1.id = "displayInterestPaidTrend";
    div1.innerHTML = "0.0%";
    div1.style.width = 30 + 'px';
    div1.style.position = "absolute";
    div1.style.fontSize = 12 + "px";
    div1.style.textAlign = 'center';
    div1.style.backgroundColor = "#aaaaaa"
    this.domRootContainer.htmlElement.appendChild(div1);
    this.domInterestPaidTrend = div1;
    
    
    
     
          
     var c = this.boxShowInterest = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
         
     
     c.x = 55;
     c.y = 472;
     this.stage.addChild(c);
     var pt = this.boxShowInterest.localToGlobal(60, 60);
     this.domShowInterestPaid.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domShowInterestPaid.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     pt = this.boxShowInterest.localToGlobal(10, 37);
     this.domInterestPaidTrend.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domInterestPaidTrend.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     this.stage.update();
     
     
}

/**
 * Setup the Debt to Lender Box for the UI.
 */
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
    
      // Create a div for displaying trend indicator
    var div1 = document.createElement("div");
    div1.id = "displayDebtToLenderTrend";
    div1.innerHTML = "0.0%";
    div1.style.width = 30 + 'px';
    div1.style.position = "absolute";
    div1.style.fontSize = 12 + "px";
    div1.style.textAlign = 'center';
    div1.style.backgroundColor = "#aaaaaa"
    this.domRootContainer.htmlElement.appendChild(div1);
    this.domDebtToLenderTrend = div1;
    
          
     var c = this.boxShowDebtToLender = new createjs.Container();
     c.addChild(s);
     c.addChild(t);
         
     
     c.x = 55;
     c.y = 572;
     this.stage.addChild(c);
     var pt = this.boxShowDebtToLender.localToGlobal(60, 60);
     this.domShowDebtToLender.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domShowDebtToLender.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
    
     pt = this.boxShowDebtToLender.localToGlobal(10, 37);
     this.domDebtToLenderTrend.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domDebtToLenderTrend.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     this.stage.update();
     
     
};

/**
 * Setup the Payback Box for the UI.
 */
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
     button1.value = "Default Off";
     button1.style.width = 160 + 'px';
     button1.style.height = 40 + 'px';
     button1.style.position = "absolute";
     button1.style.fontSize = 14 + "px";
     button1.style.fontWeight = "bold";
     button1.style.textAlign = 'center';
     button1.style.backgroundColor = "#aaaaaa";
     button1.onclick = function(e) {
         that.debtLab.setDefaultOnPaybackFlag(!that.debtLab.getDefaultOnPaybackFlag());
         that.updateUI();
     };
     
     
     this.domRootContainer.htmlElement.appendChild(button1);
     this.domSubmitDefault = button1;
     
     
    // Note payback indicator
    var div = document.createElement("div");
    div.id = "showPayback";
    
    div.style.width = 160 + 'px';
    div.style.height = 40 + 'px';
    div.style.position = "absolute";
    div.style.fontSize = 18 + "px";
    div.style.fontWeight = "bold";
    div.style.textAlign = 'center';
    div.style.lineHeight = '40px';
    div.style.borderStyle = 'solid';
    div.style.borderColor = '#000000';
    div.style.borderWidth = '2px';
    
    div.style.borderColor = '#000000';
    div.style.color = "#FF0000";
    div.style.backgroundColor = "#1AEB39";
    div.innerHTML = "NOTE PAYED";
    div.style.visibility = 'hidden';
    
    
    
    this.domRootContainer.htmlElement.appendChild(div);
    this.domPaybackIndicator = div;
    
    
    
    
     
     var c = this.boxPayback = new createjs.Container();
     c.addChild(s);
    
     c.x = 405;
     c.y = 168;
     this.stage.addChild(c);
     
     
      
     var pt = this.boxPayback.localToGlobal(18, 8);
     this.domSubmitDefault.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domSubmitDefault.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     
     pt = this.boxPayback.localToGlobal(18, 54);
     this.domPaybackIndicator.style.left = Math.round(pt.x + this.mainCanvas.offsetLeft) + "px";
     this.domPaybackIndicator.style.top = Math.round(pt.y + this.mainCanvas.offsetTop) + "px";
     
     this.stage.update();
     
     
};




/**
 * Setup the Borrow Box for the UI.
 */
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
     button1.onclick = function(e) {
         that.debtLab.doBorrow();
         that.updateUI();
     };
     

    
   
     
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

/**
 * Setup the Lender Spend Box for the UI.
 */
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
     button1.onclick = function(e) {
         that.debtLab.doLenderSpend();
         that.updateUI();
     };
    

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


/**
 * Setup the Tax Spend Box for the UI.
 */
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
      button1.onclick = function(e) {
         that.debtLab.doTaxLender();
         that.updateUI();
     };
    

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

/**
 * Setup the Years Per Minute Box for the UI.
 */
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


/**
 * Setup the Add to Lender Account Box for the UI.
 */
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
     button1.onclick = function(e) {
         that.debtLab.doAddToLenderAccount();
         that.updateUI();
     };
     
    
     
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

/**
 * Setup the Lender Account Box for the UI.
 */
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



/**
 * Update user interface to reflect simulator state.
 */
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
   
    
    if (this.domInputYearsPerMinute) {
        this.domInputYearsPerMinute.value = this.debtLab.getYearsPerMinute();
        
    }
    
    this.setAutoButton(this.debtLab.getAutoTargetMoneySupplyGrow(), this.domAutoGrowTargetMoneySupply, "Auto On", "Auto Off");
    this.setAutoButton(this.debtLab.getAutoCreatePublicMoneyFlag(), this.domAutoCreatePublicMoney, "Auto On", "Auto Off");
    
   
    this.setAutoButton(this.debtLab.getAutoLendFromLenderDepositsFlag(), this.domAutoLendFromDeposits, "Auto On", "Auto Off");
    
    this.setAutoButton(this.debtLab.getDefaultOnPaybackFlag(), this.domSubmitDefault, "Defaulting On", "Default Off");
    
    // Public Money Box
    if(this.domCreatePublicMoneyAmount) {
        this.domCreatePublicMoneyAmount.value = "$ " + _.str.numberFormat(this.debtLab.getCreatePublicMoneyAmount(),0);
    }
    
    if(this.domAutoCreatePublicMoney){
        this.setAutoButton(this.debtLab.getAutoCreatePublicMoneyFlag(), this.domAutoCreatePublicMoney, "Auto On", "Auto Off");
    }

    // Current Money Supply
    if(this.domInputMoneySupply) {
         this.domInputMoneySupply.value = "$ " + _.str.numberFormat(this.debtLab.getMoneySupply(),0);
    }
    
    if(this.domMoneySupplyTrend) {
        this.domMoneySupplyTrend.innerHTML = _.str.numberFormat(this.debtLab.getMoneySupplyTrend() * 100, 1) + "%";
    } 
    

    // Target Money Supply
    if(this.domInputMoneySupplyTarget) {
        this.domInputMoneySupplyTarget.value = "$ " + _.str.numberFormat(this.debtLab.getTargetMoneySupply(),0);
    }
    
    if(this.domTargetMoneySupplyGrowthRate) {
        this.domTargetMoneySupplyGrowthRate.value =  _.str.numberFormat(this.debtLab.getTargetMoneySupplyGrowthRate() * 100, 1) + "%/year";
    }
    
    
   
    // Interest Paid
    if(this.domShowInterestPaid) {
         this.domShowInterestPaid.innerHTML = "$ " + _.str.numberFormat(this.debtLab.getInterestPaid(),0);
    }
    
    if(this.domInterestPaidTrend) {
        this.domInterestPaidTrend.innerHTML = _.str.numberFormat(this.debtLab.getInterestPaidTrend() * 100, 1) + "%";
    } 
    
    // Debt to Lender
    if(this.domShowDebtToLender) {
         this.domShowDebtToLender.innerHTML = "$ " + _.str.numberFormat(this.debtLab.getDebtToLender(),0);
    }
    
    if(this.domDebtToLenderTrend) {
        this.domDebtToLenderTrend.innerHTML = _.str.numberFormat(this.debtLab.getDebtToLenderTrend() * 100, 1) + "%";
    } 
    
    
    // Borrow money
    if(this.domAutoBorrowAmount) {
        this.domAutoBorrowAmount.value = "$ " + _.str.numberFormat(this.debtLab.getNoteAmount(),0);
    }
    
    if(this.domAutoBorrowPercent) {
        this.domAutoBorrowPercent.value =  _.str.numberFormat(this.debtLab.getNoteInterestRate() * 100, 1) + "%";
    }
    if(this.domSubmitAutoBorrow) {
       this.setAutoButton(this.debtLab.getAutoBorrowFlag(), this.domSubmitAutoBorrow, "Auto On", "Auto Off");
    }

    // Lender Account Balance
    if(this.domInputLenderAccount) {
         this.domInputLenderAccount.value = "$ " + _.str.numberFormat(this.debtLab.getLenderAccountBalance(), 0);
    }


    // Add to lender account Box
    if(this.domAddMoneyToLenderAccountAmount) {
        this.domAddMoneyToLenderAccountAmount.value = "$ " + _.str.numberFormat(this.debtLab.getLenderAccountAddAmount(),0);
    }
    
    if(this.domAutoAddMoneyToLenderAccount) {
       this.setAutoButton(this.debtLab.getAutoAddToLenderAccountFlag(), this.domAutoAddMoneyToLenderAccount, "Auto On", "Auto Off");
    }

    // Lender Spend
    if(this.domAutoSpendPercent) {
        this.domAutoSpendPercent.value =  _.str.numberFormat(this.debtLab.getLenderSpendRate() * 100, 1) + "%";
    }
    
    if(this.domSubmitAutoSpend) {
       this.setAutoButton(this.debtLab.getAutoLenderSpendFlag(), this.domSubmitAutoSpend, "Auto On", "Auto Off");
    }
    
    
    // Tax Lender
    if(this.domAutoTaxPercent) {
        this.domAutoTaxPercent.value =  _.str.numberFormat(this.debtLab.getTaxRate() * 100, 1) + "%";
    }
    
    if(this.domSubmitAutoTax) {
       this.setAutoButton(this.debtLab.getAutoTaxLenderFlag(), this.domSubmitAutoTax, "Auto On", "Auto Off");
    }
    
       

    

};

SimulatorApp.prototype.setAutoButton = function(flag, button, onText, offText) {
    if (flag) {
       button.value = onText;
       button.style.backgroundColor = "#00FF00";
    } else {
       button.value = offText;
       button.style.backgroundColor = "#EEEEEE";
    }
};

/**
 * Update the simulator parameters from those set in
 * the user interface.
 */
SimulatorApp.prototype.updateParameters = function() {
    var value;
    
    
    
    // Years per minute simulator speed setting
    value = parseInt(this.domInputYearsPerMinute.value, 10);
    if(value > 0 && value < 51) {
       this.debtLab.setYearsPerMinute(value);
       
    }
    this.interval = (60000 / (365 * this.debtLab.getYearsPerMinute()));
    
    
    // Create Public Money Amount
    this.setIntPropertyFromInput(this.debtLab.setCreatePublicMoneyAmount,
                            this.domCreatePublicMoneyAmount,
                            1,
                            10000);
                            
    // Current Money Supply
    this.setIntPropertyFromInput(this.debtLab.setMoneySupply,
                                 this.domInputMoneySupply,
                                 100,
                                 1000000);
                                 
                                 
    // Target Money Supply
    this.setIntPropertyFromInput(this.debtLab.setTargetMoneySupply,
                                 this.domInputMoneySupplyTarget,
                                 100,
                                 10000000);
                                 
    this.setPercentPropertyFromInput(this.debtLab.setTargetMoneySupplyGrowthRate,
                                   this.domTargetMoneySupplyGrowthRate,
                                   -0.5,
                                   2.0);
                                   
                                   
    // Default Note Amount
    this.setIntPropertyFromInput(this.debtLab.setNoteAmount,
                            this.domAutoBorrowAmount,
                            1,
                            10000);  
    
    // Default Note Interest rate
    this.setPercentPropertyFromInput(this.debtLab.setNoteInterestRate,
                                   this.domAutoBorrowPercent,
                                   -0.5,
                                   2.0);
                                   
    // Change lender account balance
    // Target Money Supply
    this.setIntPropertyFromInput(this.debtLab.setLenderAccountBalance,
                                 this.domInputLenderAccount,
                                 100,
                                 10000000);
    
    
    // Add to lender account amount
    this.setIntPropertyFromInput(this.debtLab.setLenderAccountAddAmount,
                            this.domAddMoneyToLenderAccountAmount,
                            1,
                            10000);
                            
    // Lender spend rate
    this.setPercentPropertyFromInput(this.debtLab.setLenderSpendRate,
                                   this.domAutoSpendPercent,
                                   0.0,
                                   2.0);
                                   
     // Lender tax rate
    this.setPercentPropertyFromInput(this.debtLab.setTaxRate,
                                   this.domAutoTaxPercent,
                                   0.0,
                                   2.0);

};

/**
 * Set the value of a float percent fraction property from an input field.
 * 
 * @param setter {setter function} property setter for object
 * @param input {DOMElement} input DOM from user interface
 * @param min {int} minimum value of parameter
 * @param max {int} maximum value of parameter
 */
SimulatorApp.prototype.setPercentPropertyFromInput = function(setter, input, min, max) {
    
    var value = this.parseFormattedPercent(input.value);
    console.log("Percent fraction: " + value);
    if(value >= min && value <= max) {
        setter.call(this.debtLab, value);
    }
};



/**
 * Set the value of a integer object property from an input field.
 * 
 * @param setter {setter function} property setter for object
 * @param input {DOMElement} input DOM from user interface
 * @param min {int} minimum value of parameter
 * @param max {int} maximum value of parameter
 */
SimulatorApp.prototype.setIntPropertyFromInput = function(setter, input, min, max) {
    var value = this.parseFormattedInt(input.value);
    if(value >= min && value <= max) {
        setter.call(this.debtLab, value);
    }
};

/**
 * takes a string representation of a integer 
 * value and returns the integer
 * @param {String} string with embedded integer
 */
SimulatorApp.prototype.parseFormattedInt = function(value) {
      return parseInt(value.replace(/[\$,\,]/g,""), 10);
};

/**
 * takes a string representation of a percentage
 * value and returns the double fractional value
 * @param {String} string with embedded percentage
 */
SimulatorApp.prototype.parseFormattedPercent = function(value) {
      if(value.indexOf("%")=== -1) {
          value += "%";
      }
      return parseFloat(value.substring(0,value.indexOf("%")),10)/100;
};

/**
 * Flash the note payback indicator
 */
SimulatorApp.prototype.flashNotePayback = function() {
    if(this.domPaybackIndicator) {
        var that = this;
        this.indicatorBusy=true;
        this.domPaybackIndicator.style.borderColor = '#000000';
        this.domPaybackIndicator.style.color = "#FF0000";
        this.domPaybackIndicator.style.backgroundColor = "#1AEB39";
        this.domPaybackIndicator.innerHTML = "NOTE PAYED";
        this.domPaybackIndicator.style.visibility = 'visible';
        setTimeout(function() {that.domPaybackIndicator.style.visibility = 'hidden';that.indicatorBusy=false;},this.INDICATOR_FLASH_TIME);
        
        
    }
    
    
    
    
};


/**
 * Flash the note default indicator
 */
SimulatorApp.prototype.flashNoteDefault = function() {
    if(this.domPaybackIndicator) {
        var that = this;
        this.indicatorBusy=true;
        this.domPaybackIndicator.style.borderColor = '#FFFFFF';
        this.domPaybackIndicator.style.color = "#FFFFFF";
        this.domPaybackIndicator.style.backgroundColor = "#000000";
        this.domPaybackIndicator.innerHTML = "NOTE DEFAULT";
        this.domPaybackIndicator.style.visibility = 'visible';
        setTimeout(function() {that.domPaybackIndicator.style.visibility = 'hidden';that.indicatorBusy=false;},this.INDICATOR_FLASH_TIME);
    }
};




var app = new SimulatorApp();
app.init();





