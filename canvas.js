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
let movingDirection = 'L';
// to get to know if the direction is changed
let isDirectionChanged = false;
// index counter will help chaning direction of each ball
let indctr = 0;

let keyPressed = '';

let KeyData = {
    "ArrowDown": "D",
    "ArrowUp": "U",
    "ArrowLeft": "L",
    "ArrowRight": "R"
}

function init() {
    let x = 900;
    let y = 300;
    let dx = -2;
    let dy = 0;
    let radius = 20;
    let color = "#fff";

    for (let i = 0; i < 60; i++) {
        snake.push(new Ball(x + Math.abs(dx)*i, y, dx, dy, radius, color))
    }
}

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

function change_direction(ball, pressedKey) {
    if (pressedKey === "D" && movingDirection !== 'U') {
        ball.dx = 0;
        ball.dy = 2;
    } else if (pressedKey === "U" && movingDirection !== 'D') {
        ball.dx = 0;
        ball.dy = -2;
    } else if (pressedKey === "L" && movingDirection !== 'R') {
        ball.dy = 0;
        ball.dx = -2;
    } else if (pressedKey === "R" && movingDirection !== 'L') {
        ball.dy = 0;
        ball.dx = 2;
    }
}

document.addEventListener('keydown', (e) => {
    keyPressed = KeyData[e.key];
    console.log(keyPressed);

    if (
        keyPressed === "D" && movingDirection !== 'U' ||
        keyPressed === "U" && movingDirection !== 'D' ||
        keyPressed === "L" && movingDirection !== 'R' ||
        keyPressed === "R" && movingDirection !== 'L'
    ) {
        isDirectionChanged = true;
    } else {
        isDirectionChanged = false;
    }
})

function restore_speed() {
    snake.forEach(s => {
        if (s.dx != 0) {
            if (s.dx > 0) s.dx = 2;
            else s.dx = -2
        } else if (s.dy != 0) {
            if (s.dy > 0) s.dy = 2;
            else s.dy = -2;
        }
    })
}

let n;

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (isDirectionChanged) {
        change_direction(snake[indctr], keyPressed);
        indctr += 1;
    }
    snake.forEach(s => s.draw());
    snake.forEach(s => s.update());
    if (snake[0].x - snake[0].radius <= 0) {
        n = snake.length;
        snake[0].x = snake[0].x + (2*n - 1)
        for (let i = 1; i < n; i++) {
            snake[i].x = snake[i-1].x - 2;
        }
        snake.forEach(s => {
            s.dx = 2;
            s.dy = 0;
        })
    } else if (snake[0].x + snake[0].radius >= canvas.width) {
        n = snake.length;
        snake[0].x = snake[0].x - (2*n - 1);
        for (let i = 1; i < n; i++) {
            snake[i].x = snake[i-1].x + 2;
        }
        snake.forEach(s => {
            s.dx = -2;
            s.dy = 0;
        })
    }

    if (snake[0].y - snake[0].radius <= 0) {
        n = snake.length;
        snake[0].y = snake[0].y + (2*n - 1)
        for (let i = 1; i < n; i++) {
            snake[i].y = snake[i-1].y - 2;
        }
        snake.forEach(s => {
            s.dx = 0;
            s.dy = 2;
        })
    } else if (snake[0].y + snake[0].radius >= canvas.height) {
        n = snake.length;
        snake[0].y = snake[0].y - (2*n - 1);
        for (let i = 1; i < n; i++) {
            snake[i].y = snake[i-1].y + 2;
        }
        snake.forEach(s => {
            s.dx = 0;
            s.dy = -2;
        })
    }

    if (indctr == snake.length) {
        indctr = 0;
        isDirectionChanged = false;
        movingDirection = keyPressed;
        console.log(movingDirection)
        // restore_speed();
    }
}

init();
animate();