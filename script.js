const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
let currentLevel = 0;
let levels = ['levels/level1.json', 'levels/level2.json'];

class Player {
  constructor() {
    this.width = 40;
    this.height = 60;
    this.reset();
  }

  reset() {
    this.x = 50;
    this.y = canvas.height - this.height - 10;
    this.velX = 0;
    this.velY = 0;
    this.speed = 4;
    this.jumpStrength = -12;
    this.onGround = false;
  }

  update() {
    this.velY += gravity;
    this.x += this.velX;
    this.y += this.velY;

    // Sol
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velY = 0;
      this.onGround = true;
    }

    // Bords
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
    this.x = x; this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Goal {
  constructor(x, y, width, height) {
    this.x = x; this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = 'gold';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  reached(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

let player = new Player();
let platforms = [];
let goal = null;
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function handleInput() {
  player.velX = 0;
  if (keys['ArrowLeft']) player.velX = -player.speed;
  if (keys['ArrowRight']) player.velX = player.speed;
  if (keys['Space'] && player.onGround) {
    player.velY = player.jumpStrength;
    player.onGround = false;
  }
}

function checkCollisions() {
  player.onGround = false;
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
  checkCollisions();

  if (goal && goal.reached(player)) {
    loadNextLevel();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  platforms.forEach(p => p.draw());
  if (goal) goal.draw();
  player.draw();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function loadLevel(path) {
  fetch(path)
    .then(res => res.json())
    .then(data => {
      platforms = data.platforms.map(p => new Platform(p.x, p.y, p.width, p.height));
      goal = new Goal(data.goal.x, data.goal.y, data.goal.width, data.goal.height);
      player.reset();
    });
}

function loadNextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) {
    alert(\"Bravo ! Tu as fini tous les niveaux !\");
    currentLevel = 0;
  }
  loadLevel(levels[currentLevel]);
}

loadLevel(levels[currentLevel]);
gameLoop();
