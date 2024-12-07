const CANVAS_PADDING = 5;
const FPS = 70;

let keyDownListener;
let keyUpListener;

window.onload = function () {
  // Classes
  class Game {
    constructor(ctx, player) {
      this.width = ctx.canvas.width;
      this.height = ctx.canvas.height;
      this.player = player;
    }

    render = () => {
      ctx.clearRect(0, 0, this.width, this.height);

      const updatesPerSecond = FPS / this.player.speedModifier;
      const updateStep = this.player.size / updatesPerSecond;

      if (this.player.moves.has("left")) {
        this.player.x -= updateStep;
      } else if (this.player.moves.has("right")) {
        this.player.x += updateStep;
      }

      ctx.fillRect(
        this.player.x,
        this.player.y,
        this.player.size,
        this.player.size,
      );

      window.requestAnimationFrame(this.render);
    };
  }

  class Player {
    constructor({ x, y, size, speedModifier }) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speedModifier = speedModifier ?? 1;
      this.moves = new Set();

      // Events
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

  const size = 25;
  const initialPlayerX = CANVAS_PADDING;
  const initialPlayerY = ctx.canvas.height - CANVAS_PADDING - size;
  const speedModifier = 5;
  const player = new Player({
    x: initialPlayerX,
    y: initialPlayerY,
    size,
    speedModifier,
  });

  const game = new Game(ctx, player);

  game.render();
};
window.onclose = function () {
  document.removeEventListener("keydown", keyDownListener);
  document.removeEventListener("keyup", keyUpListener);
};
