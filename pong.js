const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PLAYER_SPEED = 6;
const AI_SPEED = 4;

let player = { x:0, y:canvas.height/2-PADDLE_HEIGHT/2, width:PADDLE_WIDTH, height:PADDLE_HEIGHT, score:0 };
let ai = { x:canvas.width-PADDLE_WIDTH, y:canvas.height/2-PADDLE_HEIGHT/2, width:PADDLE_WIDTH, height:PADDLE_HEIGHT, score:0 };
let ball = { x:canvas.width/2-BALL_SIZE/2, y:canvas.height/2-BALL_SIZE/2, width:BALL_SIZE, height:BALL_SIZE, speed:6, dx:6*(Math.random()>0.5?1:-1), dy:3*(Math.random()>0.5?1:-1) };

// Paddle control
let upPressed = false;
let downPressed = false;
document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowUp') upPressed = true;
    if(e.key==='ArrowDown') downPressed = true;
});
document.addEventListener('keyup', (e)=>{
    if(e.key==='ArrowUp') upPressed = false;
    if(e.key==='ArrowDown') downPressed = false;
});

// Utility
function clamp(val,min,max){ return Math.max(min,Math.min(max,val)); }
function resetBall(){ ball.x=canvas.width/2-BALL_SIZE/2; ball.y=canvas.height/2-BALL_SIZE/2; ball.speed=6; ball.dx=ball.speed*(Math.random()>0.5?1:-1); ball.dy=(Math.random()*4+2)*(Math.random()>0.5?1:-1); }

// Draw
function drawRect(x,y,w,h,color){ ctx.fillStyle=color; ctx.fillRect(x,y,w,h); }
function drawCircle(x,y,r,color){ ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.closePath(); ctx.fill(); }
function drawText(text,x,y,size=36){ ctx.fillStyle="#fff"; ctx.font=`${size}px Arial`; ctx.fillText(text,x,y); }
function drawNet(){ ctx.strokeStyle="#fff3"; ctx.setLineDash([10,15]); ctx.beginPath(); ctx.moveTo(canvas.width/2,0); ctx.lineTo(canvas.width/2,canvas.height); ctx.stroke(); ctx.setLineDash([]); }

// Update
function update(){
    if(upPressed) player.y -= PLAYER_SPEED;
    if(downPressed) player.y += PLAYER_SPEED;
    player.y = clamp(player.y,0,canvas.height-player.height);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.y < 0){ ball.y=0; ball.dy=-ball.dy; }
    if(ball.y + ball.height > canvas.height){ ball.y=canvas.height-ball.height; ball.dy=-ball.dy; }

    // Player collision
    if(ball.x<player.x+player.width && ball.x>player.x && ball.y+ball.height>player.y && ball.y<player.y+player.height){
        ball.x=player.x+player.width;
        let collidePoint=(ball.y+ball.height/2)-(player.y+player.height/2);
        collidePoint/=player.height/2;
        let angle=collidePoint*(Math.PI/4);
        ball.dx=ball.speed*Math.cos(angle);
        ball.dy=ball.speed*Math.sin(angle);
        ball.speed+=0.3;
    }

    // AI collision
    if(ball.x+ball.width>ai.x && ball.x<ai.x+ai.width && ball.y+ball.height>ai.y && ball.y<ai.y+ai.height){
        ball.x=ai.x-ball.width;
        let collidePoint=(ball.y+ball.height/2)-(ai.y+ai.height/2);
        collidePoint/=ai.height/2;
        let angle=collidePoint*(Math.PI/4);
        ball.dx=-ball.speed*Math.cos(angle);
        ball.dy=ball.speed*Math.sin(angle);
        ball.speed+=0.3;
    }

    // AI movement
    let aiCenter = ai.y + ai.height/2;
    if(ball.y + BALL_SIZE/2 < aiCenter-10) ai.y -= AI_SPEED;
    else if(ball.y + BALL_SIZE/2 > aiCenter+10) ai.y += AI_SPEED;
    ai.y = clamp(ai.y,0,canvas.height-ai.height);

    // Scoring
    if(ball.x<0){ ai.score++; resetBall(); }
    if(ball.x+ball.width>canvas.width){ player.score++; resetBall(); }
}

// Render
function render(){
    drawRect(0,0,canvas.width,canvas.height,'#111');
    drawNet();
    drawRect(player.x,player.y,player.width,player.height,'#ffb6c1');
    drawRect(ai.x,ai.y,ai.width,ai.height,'#fff');
    drawCircle(ball.x+ball.width/2, ball.y+ball.height/2, BALL_SIZE/2,'#ffb6c1');
    drawText(player.score,canvas.width/4,50,40);
    drawText(ai.score,canvas.width*3/4,50,40);
}

// Game loop
function gameLoop(){ update(); render(); requestAnimationFrame(gameLoop); }
gameLoop();
