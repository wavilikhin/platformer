let keyDownListener;
let keyUpListener;

window.onload = function () {
  // Classes
  class Game {
    CANVAS_PADDING = 10;
    BASE_SPEED = 300;
    MAX_DELTA_TIME = 0.016; // = 1s / 60 frames

    constructor(ctx, player) {
      this.width = ctx.canvas.width;
      this.height = ctx.canvas.height;
      this.player = player;
      this.ctx = ctx;

      const initialPlayerX = this.CANVAS_PADDING;
      const initialPlayerY =
        ctx.canvas.height - this.CANVAS_PADDING - player.size;
      this.player.x = initialPlayerX;
      this.player.y = initialPlayerY;

      this.player.renderX = this.player.x;

      this.lastTime = 0;
      this.accumulator = 0;
      this.fixedTimeStep = 1 / 240;
    }

    update(deltaTime) {
      const moveAmount = this.BASE_SPEED * deltaTime;

      if (this.player.moves.has("left")) {
        this.player.x -= moveAmount * this.player.speedModifier;
      } else if (this.player.moves.has("right")) {
        this.player.x += moveAmount * this.player.speedModifier;
      }

      const interpolationFactor = 0.85;
      this.player.renderX =
        this.player.renderX +
        (this.player.x - this.player.renderX) * interpolationFactor;
    }

    render = (currentTime) => {
      currentTime *= 0.001;
      let deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      // Cap delta time to prevent large jumps
      deltaTime = Math.min(deltaTime, this.MAX_DELTA_TIME);

      this.accumulator += deltaTime;

      // Update physics at a fixed time step
      while (this.accumulator >= this.fixedTimeStep) {
        this.update(this.fixedTimeStep);
        this.accumulator -= this.fixedTimeStep;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw player using interpolated position
      this.ctx.fillStyle = "blue";
      this.ctx.fillRect(
        Math.round(this.player.renderX),
        this.player.y,
        this.player.size,
        this.player.size,
      );

      window.requestAnimationFrame(this.render);
    };
  }

  class Player {
    DEFAULT_PLAYER_SIZE = 25;
    DEFAULT_SPEED_MODIFIER = 1;

    constructor({
      size = this.DEFAULT_PLAYER_SIZE,
      speedModifier = this.DEFAULT_SPEED_MODIFIER,
    }) {
      this.x = null;
      this.renderX = null;
      this.y = null;
      this.size = size;
      this.speedModifier = speedModifier;
      this.moves = new Set();
      this.setupInputHandlers();
    }

    setupInputHandlers() {
      keyDownListener = (e) => {
        switch (e.code) {
          case "ArrowLeft":
            this.moves.add("left");
            break;
          case "ArrowRight":
            this.moves.add("right");
            break;
          default:
            break;
        }
      };

      keyUpListener = (e) => {
        switch (e.code) {
          case "ArrowLeft":
            this.moves.delete("left");
            break;
          case "ArrowRight":
            this.moves.delete("right");
            break;
          default:
            break;
        }
      };
      window.addEventListener("keydown", keyDownListener);
      window.addEventListener("keyup", keyUpListener);
    }
  }

  // Init
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const player = new Player({});

  const game = new Game(ctx, player);

  game.render();
};
window.onclose = function () {
  document.removeEventListener("keydown", keyDownListener);
  document.removeEventListener("keyup", keyUpListener);
};
