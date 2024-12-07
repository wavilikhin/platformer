const CANVAS_PADDING = 5;
const FPS = 70;

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

            const distance = this.player.desiredX - this.player.x;
            console.log(distance);
            const updatesPerSecond = FPS / this.player.speedModifier
            const updateStep = this.player.size / updatesPerSecond;

            if (distance > 0) {
                if (this.player.movingDirection === 'right') {
                    this.player.x += updateStep
                }
            } else if (distance < 0) {
                if (this.player.movingDirection === 'left') {
                    this.player.x -= updateStep
                }
            }

            ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);

            window.requestAnimationFrame(this.render);
        }
    }


    class Player {
        constructor({x, y, size, speedModifier}) {
            this.x = x
            this.y = y
            this.size = size;
            this.speedModifier = speedModifier ?? 1;
            this.desiredX = x;
            this.desiredY = y;
            this.movingDirection = null;

            // Events
            window.addEventListener('keydown', function (e) {
                switch (e.code) {
                    case 'ArrowLeft':
                        player.moveLeft();
                        break;
                    case 'ArrowRight':
                        player.moveRight();
                        break;
                    default:
                        break;
                }
            });
        }

        moveLeft = () => {
            if (!this.movingDirection || this.movingDirection === 'right') {
                this.movingDirection = 'left';
                this.desiredX = this.x
            }

            this.desiredX -= this.size
        };
        moveRight = () => {
            if (!this.movingDirection || this.movingDirection === 'left') {
                this.movingDirection = 'right';
                this.desiredX = this.x
            }

            this.desiredX += this.size
        };
    }

    // Init
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const size = 25
    const initialPlayerX = CANVAS_PADDING
    const initialPlayerY = ctx.canvas.height - CANVAS_PADDING - size;
    const speedModifier = 4;
    const player = new Player({x: initialPlayerX, y: initialPlayerY, size, speedModifier});

    const game = new Game(ctx, player);


    game.render();
}
