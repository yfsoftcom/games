import leftImage from '../assets/fish-swim-left.png';
import rightImage from '../assets/fish-swim-right.png';

// Player
const playerLeft = new Image();
playerLeft.src = leftImage;
const playerRight = new Image();
playerRight.src = rightImage;

export default class Player {
    constructor({ playground, moveSpeed, mouse, gameFrame }){
        this.x = playground.width;
        this.y = playground.height/2;
        this.radius = 50;
        //this.height = 20;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 160;
        this.spriteHeight = 105;
        this.mouse = mouse;
        this.moveSpeed = moveSpeed;
        this.gameFrame = gameFrame;
    }
    update( deltaTime ){
        const dx = this.x - this.mouse.x;
        const dy = this.y - this.mouse.y;
        if (this.mouse.x != this.x){
            this.x -= dx/this.moveSpeed;
            this.moving = true;
        }
        if (this.mouse.y != this.y){
            this.y -= dy/this.moveSpeed;
            this.moving = true;
        }
        if (this.x < 0) this.x = 0;
        if (this.x > playground.width) this.x = playground.width;
        if (this.y < 50) this.y = 50;
        if (this.y > playground.height) this.y = playground.height;
        let theta = Math.atan2(dy,dx);
        this.angle = theta;
    }
    draw( ctx ){
        if (this.mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.mouse.x, this.mouse.y);
            ctx.stroke();
        }
        if (this.gameFrame % 10 == 0) {
            this.frame++;
            if (this.frame >= 12) this.frame = 0;
            if ( this.frame == 3 ||  this.frame == 7 ||  this.frame == 11) {
                this.frameX = 0;
            } else this.frameX++;
            if (this.frame < 3){
                this.frameY = 0;
            } else if (this.frame < 7){
                this.frameY = 1;
            } else if (this.frame < 11){
                this.frameY = 2;
            } else this.frameY = 0;
        }
        ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        //ctx.beginPath();
        //ctx.arc(0, 0, this.radius, 0, Math.PI * 360);
        //ctx.fill();
        if (this.x >= this.mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth * 0.8, this.spriteHeight * 0.8);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth * 0.8, this.spriteHeight * 0.8);
        }
        ctx.restore();
    }
}