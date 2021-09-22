const playground = document.getElementById('playground');
const ctx = playground.getContext('2d');

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const MOVE_SPEED = IS_MOBILE? 15: 20;
const WIDTH = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
const HEIGHT = window.innerHeight;

playground.width = WIDTH;
playground.height = HEIGHT;

// =========== Class ===============

class Thing {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 10;
    this.height = 10;
    this.speed = 1;
    this.position = {
      x: 10,
      y: 10,
    }
  }

  update(deltaTime) {
    this.position.x += this.speed;
    if (this.position.x >= this.gameWidth - this.width) {
      this.position.x = this.gameWidth - this.width;
    }
    if (this.position <= 0) {
      this.position.x = 0;
    }
  }

  draw(ctx) {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}


const one = new Thing(WIDTH, HEIGHT);

let lastTime = 0;

function animate(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  one.update(deltaTime);
  one.draw(ctx);
  requestAnimationFrame(animate);
}

animate(0);