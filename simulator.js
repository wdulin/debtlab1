


var currTimeMs = function() {
    return +new Date();
}






var Simulator = function(title, canvasId) {
    var canvas = document.getElementById(canvasId),
    self = this;
    
    // Instance variables
    this.title = title;
    this.context = canvas.getContext('2d');
    this.sprites = [];
    this.keyListeners = [];


    // Time
    
    this.startTime = 0;
    this.lastTime = 0;
    this.simTime = 0;
    this.fps = 0;
    
    
    this.paused = false;
    this.startedPausedAt = 0;
    
    this.START_FPS = 60;
    this.PAUSE_TIMEOUT = 100;
    this.DAY_MS = (60 * 60 * 1000 * 24);
    
    
    window.onkeypress = function (e) { self.keyPressed(e); };
    window.onkeydown = function (e) { self.keypressed(e); };
    
    return this;
}



// Static methods
Simulator.currTimeMs = function() {
    return +new Date();
};


Simulator.getAnimFrame = (function(cb) {
    return window.requestAnimationFrame || 
           window.webKitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(cb) {
               window.setTimeout(cb, 1000 / 60);
           };
})();
    
    
// Instance methods

Simulator.prototype = {
    
    start: function () {
        var that = this;
        
        this.startTime = Simulator.currTimeMs();
        
        Simulator.getAnimFrame( 
            function (time) {
                that.simulate.call(that, time);
        });
    },
    
    tick: function (time) {
        this.updateFrameRate(time);
        this.simTime = (Simulator.currTimeMs()) - this.startTime;
        this.lastTime = time;
    },
    
    updateFrameRate: function (time) {
        if (this.lastTime === 0) {
            this.fps = this.START_FPS;
        } else {
            this.fps = 1000 / (time - this.lastTime);
        }
    },
    
    
    simulate: function (time) {
        var that = this;
        
        if (this.paused) {
            setTimeout( function () {
                that.simulate.call(that, time);
            }, this.PAUSE_TIMEOUT);
        } else {
            
           this.tick(time);
           
            
           Simulator.getAnimFrame( function (time) {
                that.simulate.call(that, time);
           });
        }
    }
};



