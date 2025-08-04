const canvas = document.querySelector("canvas");

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d');

class Ball {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();

        if (this.dy !== 0) {
            if (
                this.y - this.radius < 0 ||
                this.y + this.radius > innerHeight
            ) {
                this.dy *= -1;
            }
            this.y += this.dy;
        }

        if (this.dx !== 0) {
            if (
                this.x - this.radius < 0 ||
                this.x + this.radius > innerWidth
            ) {
                this.dx *= -1;
            }
            this.x += this.dx;
        }
    }
}

let snake = []
// The direction in which the snake is moving 
// Values: R(Right), U(Up), D(Down), L(Left)
let movingDirection = 'R';
// to get to know if the direction is changed
let isDirectionChanged = false;
// index counter will help chaning direction of each ball
let indctr = 0;

let keyPressed = '';

function init() {
    let x = 300;
    let y = 300;
    let dx = 2;
    let dy = 0;
    let radius = 20;
    let color = "#fff";

    snake.push(new Ball(x, y, dx, dy, radius, color));
    snake.push(new Ball(x + radius * (snake.length * 2), y, dx, dy, radius, color));
    snake.push(new Ball(x + radius * (snake.length * 2), y, dx, dy, radius, color));
    snake.push(new Ball(x + radius * (snake.length * 2), y, dx, dy, radius, color));
    snake.push(new Ball(x + radius * (snake.length * 2), y, dx, dy, radius, color));
    snake.push(new Ball(x + radius * (snake.length * 2), y, dx, dy, radius, color));
}

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

function change_direction(ball, pressedKey) {
    if (pressedKey === 'ArrowDown' && movingDirection !== 'U') {
        ball.dx = 0;
        ball.dy = 2;
        // movingDirection = 'D';
    } else if (pressedKey === "ArrowUp" && movingDirection !== 'D') {
        ball.dx = 0;
        ball.dy = -2;
        // movingDirection = 'U';
    } else if (pressedKey === "ArrowLeft" && movingDirection !== 'R') {
        ball.dy = 0;
        ball.dx = -2;
        // movingDirection = 'L';
    } else if (pressedKey === "ArrowRight" && movingDirection !== 'L') {
        ball.dy = 0;
        ball.dx = 2;
        // movingDirection = 'R';
    }
}

document.addEventListener('keydown', (e) => {
    // const pressedKey = e.key;
    keyPressed = e.key;

    if (
        pressedKey === 'ArrowDown' && movingDirection !== 'U' ||
        pressedKey === "ArrowUp" && movingDirection !== 'D' ||
        pressedKey === "ArrowLeft" && movingDirection !== 'R' ||
        pressedKey === "ArrowRight" && movingDirection !== 'L'
    ) {
        isDirectionChanged = true;
    } else {
        isDirectionChanged = false;
    }

    // if (pressedKey === 'ArrowDown' && movingDirection !== 'U') {
    //     // snake.forEach(s => {
    //     //     s.dx = 0;
    //     //     s.dy = 2;
    //     // })
    //     // movingDirection = 'D';
    // } else if (pressedKey === "ArrowUp" && movingDirection !== 'D') {
    //     // snake.forEach(s => {
    //     //     s.dx = 0;
    //     //     s.dy = -2;
    //     // })
    //     // movingDirection = 'U';
    // } else if (pressedKey === "ArrowLeft" && movingDirection !== 'R') {
    //     // snake.forEach(s => {
    //     //     s.dy = 0;
    //     //     s.dx = -2;
    //     // })
    //     // movingDirection = 'L';
    // } else if (pressedKey === "ArrowRight" && movingDirection !== 'L') {
    //     // snake.forEach(s => {
    //     //     s.dy = 0;
    //     //     s.dx = 2;
    //     // })
    //     // movingDirection = 'R';
    // }
})

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (isDirectionChanged) {
        change_direction(snake[indctr], keyPressed);
        indctr += 1;
    } else {
        snake.forEach(s => s.update());
    }

    if (indctr == snake.length) {
        indctr = 0;
        isDirectionChanged = false;
        if (keyPressed === '')
    }
}

init();
animate();