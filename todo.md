## Простой платформер

* Можно прыгать кубиком с клавиатуры по платформам. С плаформами должны срабатывать коллизии
* Добавить какие то "монетки" чтобы потестить еще и другие объекты в игре с другими взаимодействиями
* при коллизии.
* Добавить условие победы (колиизия с каким-то финальным объектом)
* Добавить генератор уровней (посмотреть разные подходы)

##### 7 Dec 2024

- [x] Сделать движение плавным с учетом скорости
- [x] Сделать так чтобы перемещения не накапливались 
- [ ] Добавить ускорение 

Есть проблема с таким подходом, чат предложил вот такой вариант:

```js
class Game {
    private keysPressed: Set<string> = new Set();
    private cubePosition = { x: 0, y: 0 };
    private readonly MOVEMENT_SPEED = 5; // pixels per frame

    constructor() {
        // Add event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        // Start the game loop
        requestAnimationFrame(this.gameLoop);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        // Prevent default behavior for arrow keys to avoid scrolling
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
        this.keysPressed.add(event.key);
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        this.keysPressed.delete(event.key);
    };

    private gameLoop = () => {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop);
    };

    private update() {
        // Update cube position based on pressed keys
        if (this.keysPressed.has('ArrowRight')) {
            this.cubePosition.x += this.MOVEMENT_SPEED;
        }
        if (this.keysPressed.has('ArrowLeft')) {
            this.cubePosition.x -= this.MOVEMENT_SPEED;
        }
    }

    private render() {
        // Your rendering logic here
    }

    // Clean up when needed
    public destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
}
```
То есть у него "скорость" это количество пикселей на которое нужно двинуть за animation frame.
А у меня при нажатии накапливается желаемое смещение по x, что не удобно, так как я могу зажать
стрелку и на каждый тик будет накапливаться смещение, а по логике игрок должен двигаться только пока
я держу кнопку. Как только я ее отпустил - он перестал двигаться.
Нужно переписать логику. DesiredX тут по сути вообще не нужен, нужно просто менять смещение на шаг
пока зажата или нажата кнопка.