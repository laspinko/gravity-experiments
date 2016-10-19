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

function planet(a,r,m){
    return {coord:a,vel:vec(0,0),r:r,m:m};
}
var G=6.674*0.001;
function gravity(a,b){
    return G*a.m*b.m/dis(a.coord,b.coord);
}

function rand(a,b){
    return Math.random()*(b-a)+a;
}
var p=[];
for(var i=0;i<7;i++){
    p[i]=planet(vec(rand(-width/2,width/2),rand(-height/2,height/2)),rand(5,20),10);
}
/*p[0]=planet(vec(0,0),50,10);
p[1]=planet(vec(50,300),20,10);
p[1].vel=vec(0,-10);*/
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

function update() {
    draw();
    for(var i=0;i<p.length;i++){
        for(var j=0;j<p.length;j++){
            if(i!=j){
                p[i].vel=add(p[i].vel,mul(normalize(sub(p[j].coord,p[i].coord)),gravity(p[i],p[j])));
            }
        }
    }
    
    var collVel = [];
    
    for(var i=0;i<p.length;i++){
        collVel[i] = vec(0,0);  
    }
    for(var i=0;i<p.length;i++){
        for(var j=0;j<p.length;j++){
            if(i!=j && dis(p[i].coord,p[j].coord)<=p[i].r+p[j].r){
                var k=sub(p[j].coord,p[i].coord);
                var pr=proj(p[i].vel,k);
                
                collVel[j] = add(collVel[j],mul(pr,1));
                collVel[i] = sub(collVel[i],mul(pr,1));
            }
        }
    }
    
    for(var i=0;i<p.length;i++){
        p[i].vel = add(p[i].vel,collVel[i]);  
    }
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
    ctx.translate(width/2,height/2);
    for(var i=0;i<p.length;i++){
        circle(p[i].coord,p[i].r);
    }
    ctx.translate(-width/2,-height/2);
}
update();