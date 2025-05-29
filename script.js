const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;

class Player {
  constructor() {
    this.width = 40;
    this.height = 60;
    this.x = 50;
    this.y = canvas.height - this.height;
    this.velX = 0;
    this.velY = 0;
    this.speed = 3;
    this.jumpStrength = -12;
    this.onGround = false;
  }

  update() {
    this.velY += gravity;
    this.x += this.velX;
    this.y += this.velY;

    // Collision avec le sol
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    // Garder le joueur dans les limites
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const player = new Player();
const platforms = [
  new Platform(200, 300, 100, 10),
  new Platform(350, 250, 100, 10),
  new Platform(500, 200, 100, 10),
];

const keys = {};

window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function handleInput() {
  player.velX = 0;
  if (keys['ArrowLeft']) player.velX = -player.speed;
  if (keys['ArrowRight']) player.velX = player.speed;
  if (keys['Space'] && player.onGround) {
    player.velY = player.jumpStrength;
    player.onGround = false;
  }
}

function checkPlatformCollision() {
  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y + player.height > plat.y &&
      player.y + player.height < plat.y + plat.height + player.velY
    ) {
      player.y = plat.y - player.height;
      player.velY = 0;
      player.onGround = true;
    }
  }
}

function update() {
  handleInput();
  player.update();
  checkPlatformCollision();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  platforms.forEach(p => p.draw());
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
