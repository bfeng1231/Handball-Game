const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

let mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener("mousemove", event => {
  mouse.x = event.x;
  mouse.y = event.y;
  //console.log(mouse.x, mouse.y)
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

const borderSize = 25;
const paddleWidth = 15;
const paddleHeight = 150;
const paddleDist = 100;

let score = 0;
let lives = 1;

class Paddle {
  constructor(paddleWidth, paddleHeight, style, x) {
    this.paddleWidth = paddleWidth;
    this.paddleHeight = paddleHeight;
    this.style = style;
    this.x = x;
  }

  draw() {
    ctx.fillStyle = this.style;
    if (borderSize >= mouse.y - this.paddleHeight / 2) {
      ctx.fillRect(this.x, borderSize, this.paddleWidth, this.paddleHeight);
    } else if (canvas.height - borderSize <= mouse.y + this.paddleHeight / 2) {
      ctx.fillRect(
        this.x,
        canvas.height - borderSize - this.paddleHeight,
        this.paddleWidth,
        this.paddleHeight
      );
    } else if (
      borderSize < mouse.y - this.paddleHeight / 2 &&
      canvas.height - borderSize > mouse.y + this.paddleHeight / 2
    ) {
      ctx.fillRect(
        this.x,
        mouse.y - this.paddleHeight / 2,
        this.paddleWidth,
        this.paddleHeight
      );
    }
  }
}

class Ball {
  constructor() {
    this.radius = 20;
    this.x = canvas.width / 2;
    this.y =
      Math.random() * (canvas.height - borderSize * 2 - this.radius * 2) +
      (borderSize * 2 + this.radius);
    this.dx = -8;
    this.dy = 8;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "red";
    ctx.fill();
  }

  update(player) {
    if (this.x + this.radius > canvas.width - borderSize) {
      this.dx = -Math.abs(this.dx + 0.5);
      score++;
      if (this.dy < 0) this.dy -= 0.5;
      else this.dy += 0.5;
    }
    if (this.x - this.radius < borderSize) {
      this.dx = -this.dx;
      console.log("lose life");
      lives--;
    }
    if (
      this.y + this.radius > canvas.height - borderSize ||
      this.y - this.radius < borderSize
    ) {
      this.dy = -this.dy;
    }

    if (
      mouse.y - paddleHeight / 2 < this.y + this.radius &&
      this.y - this.radius < mouse.y + paddleHeight / 2
    )
      if (player.x + paddleWidth > this.x - this.radius) {
        console.log("collsion");
        this.dx = -this.dx;
        this.dy = -this.dy;
      }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

let player, ball;

function init() {
  player = new Paddle(
    paddleWidth,
    paddleHeight,
    "yellow",
    borderSize + paddleDist
  );
  ball = new Ball();
}

function restart() {
  lives = 1;
  score = 0;
  ball = new Ball();
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create Game Environment
  ctx.fillStyle = "black";
  ctx.fillRect(
    borderSize,
    borderSize,
    canvas.width - borderSize * 2,
    canvas.height - borderSize * 2
  );
  ctx.beginPath();
  ctx.moveTo(Math.round(canvas.width / 2), 0);
  ctx.lineWidth = 10;
  ctx.lineTo(Math.round(canvas.width / 2), canvas.height);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.fillStyle = "black";
  for (let i = 1; i < 8; i++) {
    ctx.fillRect(
      borderSize,
      ((canvas.height - borderSize) / 8) * i,
      canvas.width - borderSize * 2,
      borderSize
    );
  }
  ctx.font = "40px Verdana";
  ctx.fillStyle = "white";
  ctx.textBaseline = "hanging";
  ctx.fillText("Score: " + score, borderSize + 10, borderSize + 10);

  player.draw();

  if (lives <= 0) {
    alert("Game Over\nScore: " + score);
    restart();
  } else {
    ball.update(player);
  }
}

init();
animate();
