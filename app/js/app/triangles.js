/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, requirejs */

define([], function () {
    'use strict';
    var TrianglesScript = function (options) {
        // Settings
        
        this.density = 1;

        this.drawDistance = 80;
        this.baseRadius = 1;
        this.maxLineThickness = 3;
        this.reactionSensitivity = 2;
        this.lineThickness = 1;

        this.points = [];
        this.mouse = { x: -1000, y: -1000, down: false };

        this.animation = null;

        this.canvas = null;
        this.context = null;

        this.scaleFactor = (window.innerWidth/1920);
        this.topOffset = options.topOffset || (window.innerHeight - 850 * this.scaleFactor)/2;
        this.leftOffset = options.leftOffset ||  0;

        this.imageInput = null;
        this.bgImage = null;
        this.bgCanvas = null;
        this.bgContext = null;
        this.bgContextPixelData = null;
        this.color = 'white';
        
        this.maxLineDistance = options.maxLineDistance;
        this.maxLineDistance2 = options.maxLineDistance2;
        this.static = options.static;
        this.src = options.src;
        this.canvasId = options.canvasId;
        this.scaleFactor = options.scaleFactor || this.scaleFactor ;
        
        this.counterValue = options.counterValue;
        this.counter = function () {
            this.duration = (Date.now() - this.startTime)*this.counterValue;    
        };
        this.init();
    };

    TrianglesScript.prototype = {

        init: function () {
            // Set up the visual canvas
            this.canvas = document.getElementById(this.canvasId);
            this.context = this.canvas.getContext('2d');
            this.context.globalCompositeOperation = "lighter";
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.canvas.style.display = 'block';
            this.context.strokeStyle = this.color;
            this.context.fillStyle = this.color;
            
//            document.getElementById('service-web').addEventListener('scroll', function () {
//                this.exit = true;
//            }.bind(this), false);
//
            if(!this.static){
                this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
                this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
                this.canvas.addEventListener('mouseup',   this.mouseUp.bind(this),   false);
                this.canvas.addEventListener('mouseout',  this.mouseOut.bind(this),  false);
            }
            window.onresize = function (event) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.onWindowResize();
            }.bind(this);

            this.loadData();
        },
        preparePoints: function () {
            function moveForward(center, point) {
                var minDistance = 3000;

                var m1pow = Math.min(1500, (Math.abs(point.x - center.x) / 100) * minDistance);
                var m2pow = Math.min(1500, (Math.abs(point.y - center.y) / 100) * minDistance);
                if (m1pow < 400 && m2pow < 400) {
                    if (m1pow == Math.max(m1pow, m2pow)) {
                        m1pow = 3000;
                    } else {
                        m2pow = 3000;
                    }
                }

                var m1 = (point.x - center.x > 0) ? m1pow : m1pow * -1;
                var m2 = (point.y - center.y > 0) ? m2pow : m2pow * -1;

                return {
                    x: Math.floor(point.x + (point.x - center.x) * Math.random() * 4 + m1),
                    y: Math.floor(point.y + (point.y - center.y) * Math.random() * 4 + m2)
                };
            }
            var center = {x: 500, y: 500};
            // Clear the current points
            this.points = [];

            var width, height, i, j, l;

            var clr = this.bgContextPixelData.data;

            for (i = 0; i < this.canvas.height; i += this.density) {
                for (j = 0; j < this.canvas.width; j += this.density) {
                    
                    var y = i * this.scaleFactor + this.topOffset;
                    var x = j * this.scaleFactor + this.leftOffset;
                    
                    var pos = (j + i * this.bgContextPixelData.width) * 4;

                    // Dont use white pixels
                    // we use white/black map so if r!= 0  - continue
                    if (clr[pos] !== 255 &&  clr[pos + 1] !== 255) {
                        continue;
                    }
                    var start = moveForward(center, {x: j, y: y});

                    //var rand  = Math.round(Math.random() * 2 - 2);
                    this.points.push({
                        startX: start.x,
                        startY: start.y,
                        endX: -100 * Math.random()*100,
                        endY: -100,
                        x: start.x,
                        y: start.y,
                        originalX: x,
                        originalY: y,
                        color: this.color,
                        r: this.baseRadius,
                        distance: (clr[pos] == 255) ? this.maxLineDistance2 : null,
                        start: {
                            duration: (Math.random() * 2 + 2) * 1000,
                            delay: Math.random() * 2000 + 400
                        }
                    });

                }
            }
            console.log(this.points.length)
        },

        reactPoints: function() {

            var i, currentPoint, theta, distance, start;
            function easing (t, b, c, d) {
                return c * (1 - Math.pow(1 - (t / d), 10)) + b;
            }
            for (i = 0; i < this.points.length; i++ ){
                currentPoint = this.points[i];
                if(this.duration<currentPoint.start.delay){
                    continue;
                }
                if(this.duration<=currentPoint.start.duration + currentPoint.start.delay){
                    var start = this.duration - currentPoint.start.delay;
                    currentPoint.x = easing(start, currentPoint.startX, (currentPoint.originalX - currentPoint.startX), currentPoint.start.duration);
                    currentPoint.y = easing(start, currentPoint.startY, (currentPoint.originalY - currentPoint.startY), currentPoint.start.duration);
                } else {
                    theta = 1;
                    theta = Math.atan2( currentPoint.y - this.mouse.y, currentPoint.x - this.mouse.x);

                    if ( this.mouse.down ) {
                        distance = this.reactionSensitivity * 200 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
                                                                              (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
                    } else {
                        distance = this.reactionSensitivity * 100 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
                                                                              (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
                    }
                    currentPoint.x += Math.cos(theta) * distance + (currentPoint.originalX - currentPoint.x) * 0.05 ;
                    currentPoint.y += Math.sin(theta) * distance + (currentPoint.originalY - currentPoint.y) * 0.05 ;
                }
            }
        },

        sqrt: (function (){
            var results = {};
            return function (x1,x2,y1,y2) {
                var  distance, xx,yy;
                //            name = Array.prototype.join.call(arguments,'');
                //            if(results[name]){
                //                return results[name]
                //            }
                xx = x2 - x1;
                yy = y2 - y1;
                /*results[name] =*/ distance = Math.sqrt(xx * xx + yy * yy);
                return distance;
            }
        }()),

        drawLines: function() {

            var i, j, currentPoint, otherPoint, distance, lineThickness, distanceLimit, len, _points, __points;
            var links = [];
            var regularDistance = this.points[0].distance; // distance refference
            var layers = [];
            var steps = 2, curStep;
            
            
            this.context.lineWidth = 1;
            
            
            layers[0] = this.points.filter(function (el) {
                if(el.distance === regularDistance){
                    return el;
                }
            });
            
            layers[1] = this.points.filter(function (el) {
                if(el.distance !== regularDistance){
                    return el;
                }
            });
//            console.log(this.points.length,layers[0].length, layers[1].length)
            for (curStep=0; curStep < steps; curStep++){
                _points = layers[curStep];
                
                while ( currentPoint = _points.pop()) {
                    // Draw the dot.
                    __points = _points.slice();
                    while ( otherPoint = __points.pop() ) {
                        if(currentPoint.distance){
                            distanceLimit = currentPoint.distance;
                        }else{
                            distanceLimit = this.drawDistance
                        }
                        distance = this.sqrt(currentPoint.x, otherPoint.x, currentPoint.y, otherPoint.y);
                        if (distance < distanceLimit) {
                            this.context.beginPath()
                            this.context.lineWidth = (1 - (distance / distanceLimit)) * this.maxLineThickness * this.lineThickness;
                            this.context.moveTo(currentPoint.x, currentPoint.y);
                            this.context.lineTo(otherPoint.x, otherPoint.y);
                            this.context.stroke();
                        }
                    }
                }
            }
            

        },

        drawPoints: function() {

            var i, currentPoint;
            this.context.beginPath();
            //console.log(this.points.length)
            for ( i = 0; i < this.points.length; i++ ) {

                currentPoint = this.points[i];

                // Draw the dot.

                this.context.rect(currentPoint.x , currentPoint.y, 4, 4);
                //this.context.arc(currentPoint.x , currentPoint.y, 4 , 0 , Math.PI*2, true);




            }
            this.context.fill();
            //

        },

        draw: function(_self) {
            var _self = _self||this;
            _self.counter();
            
            _self.clear();

            var dist = (_self.maxLineDistance*12)/Math.pow(_self.duration/(_self.maxLineDistance*12), 1.2);

            _self.drawDistance = Math.min(_self.maxLineDistance*12, Math.max(_self.maxLineDistance, dist));
            if (_self.static && _self.points[0].x == _self.points[0].originalX) {
                _self.started = false;
            }
            //console.log(Math.min(500, Math.max(this.maxLineDistance, dist)));

            _self.reactPoints();
            _self.drawLines();
            //this.drawPoints();}
            if(_self.started){
                _self.animation = requestAnimationFrame(function (){_self.draw(_self)});
            }

        },

        clear: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        },
        
        start: function () {
            if(!this.ready){
                console.log('not ready yet');
                setTimeout(this.start.bind(this),300); // start watcher for ready
                return false;
            }
            if(this.started){
                console.log('alrady started');
                return false;
            }
            if(!this.startTime){
                this.startTime = new Date().getTime();
            }
            this.started = true;

            this.draw();
            
        },
        stop: function () {
            if(!this.started){
                return false;
            }
            this.startTime = false;
            this.started = false;
            cancelAnimationFrame(this.animation);
            
        },
        exit: function () {
            if(!this.started){
                return false;
            }
            this.counter = function () {
                if(!this.exitTime){
                    this.exitTime = new Date().getTime();
                }
                this.duration =  4000 - (Date.now() - this.exitTime)*2;
                if(this.duration<=0){
                    this.exitTime = false;
                    this.stop();    
                }
            };        
        },

        // The filereader has loaded the image... add it to image object to be drawn
        loadData: function(  ) {

            this.bgImage = new Image;
            this.bgImage.src = this.src;

            this.bgImage.onload = function() {
                //this
                this.drawImageToBackground();
            }.bind(this)
        },

        // Image is loaded... draw to bg canvas
        drawImageToBackground: function () {

            this.bgCanvas = document.createElement( 'canvas' );
            this.bgCanvas.width = this.canvas.width;
            this.bgCanvas.height = this.canvas.height;

            var newWidth, newHeight;

            // If the image is too big for the screen... scale it down.
            //        if ( this.bgImage.width > this.bgCanvas.width - 100 || this.bgImage.height > this.bgCanvas.height - 100) {
            //
            //            var maxRatio = Math.max( this.bgImage.width / (this.bgCanvas.width - 100) , this.bgImage.height / (this.bgCanvas.height - 100) );
            //            newWidth = this.bgImage.width / maxRatio;
            //            newHeight = this.bgImage.height / maxRatio;
            //
            //        } else {
            //            newWidth = this.bgImage.width;
            //            newHeight = this.bgImage.height;
            //        }

            // Draw to background canvas
            this.bgContext = this.bgCanvas.getContext( '2d' );
            this.bgContext.drawImage( this.bgImage,0,0);
            this.bgContextPixelData = this.bgContext.getImageData( 0, 0, this.bgCanvas.width, this.bgCanvas.height );

            this.preparePoints();
            this.ready = true;
        },

        mouseDown: function( event ){
            this.mouse.down = true;
        },

        mouseUp: function( event ){
            this.mouse.down = false;
        },

        mouseMove: function(event){
            this.mouse.x = event.offsetX || (event.layerX - this.canvas.offsetLeft);
            this.mouse.y = event.offsetY || (event.layerY - this.canvas.offsetTop);
        },

        mouseOut: function(event){
            this.mouse.x = -1000;
            this.mouse.y = -1000;
            this.mouse.down = false;
        },

        // Resize and redraw the canvas.
        onWindowResize: function() {
            cancelAnimationFrame( this.animation );
            this.drawImageToBackground();
        }

        }

    return TrianglesScript;
})
