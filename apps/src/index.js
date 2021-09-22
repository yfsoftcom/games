import './css/common.css';
import pop2 from './assets/pop2.png';
import Player from './objects/player';

const playground = document.getElementById('playground');
const ctx = playground.getContext('2d');

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const MOVE_SPEED = IS_MOBILE? 15: 10;
const WIDTH = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

playground.width = WIDTH;
playground.height = window.innerHeight;
let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

// Mouse interactivity
let canvasPosition = playground.getBoundingClientRect();
const mouse = {
    x: playground.width/2,
    y: playground.height/2,
    click: false
}
playground.addEventListener(IS_MOBILE? 'touchmove': 'mousemove', function(e){
    const x = IS_MOBILE? e.targetTouches[0].clientX: e.x;
    const y = IS_MOBILE? e.targetTouches[0].clientY: e.y;
    mouse.click = true;
    mouse.x = x - canvasPosition.left;
    mouse.y = y - canvasPosition.top;
    e.preventDefault();
}, false);
playground.addEventListener(IS_MOBILE? 'touchend': 'mouseup', function(e){
    mouse.click = false;
    e.preventDefault();
}, false);


const player = new Player({
  playground,
  moveSpeed: MOVE_SPEED,
  mouse,
  gameFrame,
});

// Bubbles
const bubblesArray = [];
const bubble = new Image();
bubble.src = pop2;
class Bubble {
    constructor(){
        this.x = Math.random() * playground.width;
        this.y = 0 - 50 - Math.random() * playground.height/2;
        this.radius = 50;
        this.speed = Math.random() * -5 + -1;
        this.distance;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.counted = false;
        this.frameX = 0;
        this.spriteWidth = 91;
        this.spriteHeight = 91;
        this.pop = false;
        this.counted = false;
    }
    update(){
        this.y -= this.speed
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
      /*
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();*/
        ctx.drawImage(bubble, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - 68, this.y - 68, this.spriteWidth*1.5, this.spriteHeight*1.5);
    }
}
function handleBubbles(){
    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].y > playground.height * 2){
            bubblesArray.splice(i, 1);
        }
    }
    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
            popAndRemove(i);
        }
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }
    if (gameFrame % 50 == 0) {
        bubblesArray.push(new Bubble());

    }
}
function popAndRemove(i){
    if (bubblesArray[i]) {
        if (!bubblesArray[i].counted) score++;
        bubblesArray[i].counted = true;
        bubblesArray[i].frameX++;
        if (bubblesArray[i].frameX > 7) bubblesArray[i].pop = true;
        if (bubblesArray[i].pop) bubblesArray.splice(i, 1);
        requestAnimationFrame(popAndRemove);
    }

}

/**** BUBBLE TEXT ***/ 
let bubbleTextArray = [];
let adjustX = -3;
let adjustY = -3;
ctx.fillStyle = 'white';
ctx.font = '17px Verdana';
ctx.fillText('LIQUID', 20, 42);
//ctx.font = '19px Verdana';
//ctx.fillText('TEXT', 36, 49);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 7;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 15) + 1;
        this.distance;
    }
    draw() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(34,147,214,1)';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        if (this.distance < 50){
            this.size = 14;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 4, this.y -4, this.size/3, 0, Math.PI * 2);
            ctx.arc(this.x -6, this.y -6, this.size/5, 0, Math.PI * 2);
        } else if (this.distance <= 80){
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 3, this.y -3, this.size/2.5, 0, Math.PI * 2);
            ctx.arc(this.x -4, this.y -4, this.size/4.5, 0, Math.PI * 2);
        }
        else {
            this.size = 5;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 1, this.y -1, this.size/3, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill()
    }
    update(){
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < 100){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/20;
            }
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }
    }
}

function init2() {
    bubbleTextArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                bubbleTextArray.push(new Particle2(positionX * 8, positionY * 8));
            }
        }
    }
}
// init2();
console.log(bubbleTextArray);
/** bubble text end **/

let lastTime = 0;
// animation loop
function animate(timestamp){
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, playground.width, playground.height);
    for (let i = 0; i < bubbleTextArray.length; i++){
        bubbleTextArray[i].draw(deltaTime);
        bubbleTextArray[i].update(ctx);
    }
    handleBubbles();
    player.update(deltaTime);
    player.draw(ctx);
    ctx.fillStyle = 'rgba(34,147,214,1)';
    ctx.font = '20px Georgia';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('score: ' + score, 141, 336);
    ctx.fillStyle = 'rgba(34,147,214,1)';
    ctx.fillText('score: ' + score, 140, 335);
    gameFrame += 1;
    requestAnimationFrame(animate);
}
animate(0);

window.addEventListener('resize', function(){
  canvasPosition = playground.getBoundingClientRect();
  mouse.x = playground.width/2;
  mouse.y = playground.height/2;
});