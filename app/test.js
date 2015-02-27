var img = document.createElement('IMG');
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');
ctx.fillStyle = "#999999";

ctx.lineWidth = 2;

var drawer = function(){
    ctx.fillStyle = "#96B03C";
    ctx.fillRect(0,0,640,320);
    drawer.draw();  
};

drawer.stack = [];
drawer.draw  = function(){
    ctx.save();
    ctx.fillStyle = "#96B03C";
    //ctx.fillRect(0,0,640,320);
    this.stack.forEach(function(el,index){
        el()    
    })
    
    //ctx.clip();
    //ctx.drawImage(img, 0, 0);
    //ctx.restore();
    requestAnimationFrame(this.draw.bind(this))
}

function drawTriangle(height,speed,left, top) {
    var h = height;
    var s = speed||1;
    var l = left||0;
    var t = top||480;
    var color = "#ffffff";
    var phase = 0;
    var phase2 = 0;
    var dev = 50;
    
    return function(){
        phase2= phase2+.021235;
        phase = phase+.01
        
        var x = canvas.width / 2 +phase*phase;
        var y = canvas.height / 2 +  Math.tan(phase)*dev;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2*Math.PI, true);
        // line color
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
       
        
    }
}
for(var x = 1; x<2; x++){
  drawer.stack.push(drawTriangle(0,Math.floor(Math.random()*2)+1,300,320)); 
}

img.onload = function () {drawer()}
img.src = "img/logo-large.svg";