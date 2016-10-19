var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById("canvas-id");
var width=700,height=700;
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");

function vec(x,y){
    return  {x:x,y:y};
}
function dot(a,b){
    return a.x*b.x+a.y*b.y;
}
function mag(a){
    return Math.sqrt(a.x*a.x+a.y*a.y);
}
function mag2(a){
    return a.x*a.x+a.y*a.y;
}
function dis(a,b){
    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function dis2(a,b){
    return (a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y);
}
function mul(a,b){
    return {x:a.x*b,y:a.y*b};
}
function add(a,b){
    return {x:a.x+b.x,y:a.y+b.y};
}
function sub(a,b){
    return {x:a.x-b.x,y:a.y-b.y};
}
function normalize(a){
    return mul(a,1/mag(a));
}
function proj(a,b){
    return mul(b,dot(a,b)/mag2(b));
}

function planet(a,r){
    return {coord:a,vel:vec(0,0),r:r,m:Math.PI * r * r};
}
var G=6.674*0.0000001;
function gravity(a,b){
    return G*a.m*b.m/dis2(a.coord,b.coord);
}

function rand(a,b){
    return Math.random()*(b-a)+a;
}


class quadTree{
    constructor(from,to,elements){
        
    }
}


var p=[];
for(var i=0;i<10;i++){
    var coord = vec(rand(-width/2,width/2),rand(-height/2,height/2));
    var r = rand(5,20)
    p.push(planet(coord,r));
    //p.push(planet(sub(vec(0,0),coord),r));
}

window.addEventListener("keydown", function (args) {
    
}, false);

window.addEventListener("keyup", function (args) {
	
}, false);

window.addEventListener("mouseup", function (args) {
}, false);

window.addEventListener("mousemove", function (args) {	
}, false);

window.addEventListener("mousedown", function (args) {
}, false);

var friction = false;

function update() {
    draw();
    for(var i=0;i<p.length;i++){
        for(var j=0;j<p.length;j++){
            if(i!=j){
                p[i].vel=add(p[i].vel,mul(normalize(sub(p[j].coord,p[i].coord)),gravity(p[i],p[j])));
            }
        }
    }
    if(friction){
        for(var i=0;i<p.length;i++){
            p[i].vel = mul(p[i].vel, 1-0.0001*Math.PI*p[i].r);
        }
    }
    
    
    var collision;
    
    do{
        collision = false;
        var collVel = [];

        for(var i=0;i<p.length;i++){
            collVel[i] = vec(0,0);  
        }
        for(var i=0;i<p.length;i++){
            for(var j=0;j<p.length;j++){
                if(i!=j && dis(p[i].coord,p[j].coord)<=p[i].r+p[j].r){
                    var k=sub(p[j].coord,p[i].coord);
                    var pr=proj(p[i].vel,k);

                    collVel[j] = add(collVel[j],pr);
                    collVel[i] = sub(collVel[i],pr);
                }
            }
        }


        for(var i=0;i<p.length;i++){
            for(var j=0;j<p.length;j++){
                if(i!=j && dis(p[i].coord,p[j].coord)<=p[i].r+p[j].r){
                    var k=mul(normalize(sub(p[j].coord, p[i].coord)) ,p[i].r + p[j].r - dis(p[i].coord,p[j].coord));
                    p[i].coord = sub(p[i].coord, k);
                    p[j].coord = add(p[j].coord, k);
                    collision = true;
                }
            }
        }

        for(var i=0;i<p.length;i++){
            p[i].vel = add(p[i].vel,collVel[i]);
        }
    }while(collision);
    
    
    for(var i=0;i<p.length;i++){
        p[i].coord=add(p[i].coord,p[i].vel);
    }
    
	setTimeout(update, 10);
}
function drawLine(a,b){
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();
    ctx.closePath();
}
function circle(a,r){
    ctx.beginPath();
    ctx.arc(a.x,a.y,r,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
}
function draw() {
    ctx.strokeStyle="black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    
    ctx.fillRect(-1,-1,2,2);
    for(var i=0;i<p.length;i++){
        circle(add(p[i].coord,vec(width/2,height/2)),p[i].r);
    }
}
update();