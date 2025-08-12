const canvas = document.querySelector("canvas");

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d');

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getDistance(ball1, ball2) {
    let x = ball1.x - ball2.x;
    let y = ball1.y - ball2.y;

    return Math.sqrt(x ** 2 + y ** 2);
}


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

        this.draw();
    }
}

let snake = []
let food = ''
// The direction in which the snake is moving 
// Values: R(Right), U(Up), D(Down), L(Left)
let movingDirection = 'L';
let movingDirectionArray = [];
let indexArray = [];
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

let foodradius = 20
let foodcolor = 'red';
let speed = 4;

let points = 0;

function generateFood() {
    let x = randomIntFromRange(100, canvas.width - 100);
    let y = randomIntFromRange(100, canvas.height - 100);
    food = new Ball(x, y, 0, 0, foodradius, foodcolor);
    for (let i = 0; i < snake.length; i++) {
        if (getDistance(snake[i], food) < 15) {
            x = randomIntFromRange(100, canvas.width - 100);
            y = randomIntFromRange(100, canvas.height - 100);
            i = -1;
        }
    }
    // console.log(x, y);
    food.x = x;
    food.y = y;
}

function create_snake(n, gap, x, y, dx, dy, radius, color) {
    snake = []
    for (let i = 0; i < n; i++) {
        snake.push(new Ball(x + gap * i, y, dx, dy, radius, color))
    }
}

function init() {
    let x = 900;
    let y = 300;
    let dx = -1 * speed;
    let dy = 0;
    let radius = 20;
    let color = "#fff";

    create_snake(60, speed, x, y, dx, dy, radius, color);

    generateFood()
}

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

function change_direction(ball, pressedKey) {
    if (pressedKey === "D") {
        ball.dx = 0;
        ball.dy = speed;
    } else if (pressedKey === "U") {
        ball.dx = 0;
        ball.dy = -1 * speed;
    } else if (pressedKey === "L") {
        ball.dy = 0;
        ball.dx = -1 * speed;
    } else if (pressedKey === "R") {
        ball.dy = 0;
        ball.dx = speed;
    }
}

function increase_snake(snake) {
    for (let i = 0; i < 5; i++) {
        let x = snake[snake.length - 1].x;
        let y = snake[snake.length - 1].y;
        let radius = snake[snake.length - 1].radius;
        let color = snake[snake.length - 1].color;
        if (movingDirection === 'D') {
            snake.push(new Ball(x, y - speed, 0, speed, radius, color));
        } else if (movingDirection === 'U') {
            snake.push(new Ball(x, y + speed, 0, -1 * speed, radius, color));
        } else if (movingDirection === 'L') {
            snake.push(new Ball(x + speed, y, -1 * speed, 0, radius, color));
        } else if (movingDirection === 'R') {
            snake.push(new Ball(x - speed, y, speed, 0, radius, color));
        }
    }
}

document.addEventListener('keydown', (e) => {
    keyPressed = KeyData[e.key];
    console.log(keyPressed);
    let lastMovingDirection;
    if (movingDirectionArray.length === 0) {
        lastMovingDirection = movingDirection
    } else {
        lastMovingDirection = movingDirectionArray[movingDirectionArray.length - 1];
    }
    if (
        keyPressed === "D" && lastMovingDirection !== 'U' ||
        keyPressed === "U" && lastMovingDirection !== 'D' ||
        keyPressed === "L" && lastMovingDirection !== 'R' ||
        keyPressed === "R" && lastMovingDirection !== 'L'
    ) {
        isDirectionChanged = true;
        movingDirectionArray.push(keyPressed);
        indexArray.push(0);
    } else {
        isDirectionChanged = false;
    }
})

let n;

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (isDirectionChanged) {
        for (let i = 0; i < indexArray.length; i++) {
            change_direction(snake[indexArray[i]], movingDirectionArray[i]);
            indexArray[i] = indexArray[i] + 1
        }
        // change_direction(snake[indctr], keyPressed);
        // indctr += 1;
    }

    food.draw();

    // snake.forEach(s => s.draw());
    snake.forEach(s => s.update());

    ctx.font = "48px serif";
    ctx.fillStyle = 'white';
    ctx.fillText(`Points: ${points}`, canvas.width - 200, 50);

    // food collision detection logic
    if (getDistance(snake[0], food) < snake[0].radius + food.radius) {
        points += 1;
        generateFood();
        increase_snake(snake);
    }

    // Boundary collision detection logic
    if (snake[0].x - snake[0].radius <= 0) {
        // n = snake.length;
        // snake[0].x = snake[0].x + (2 * n - 1)
        // for (let i = 1; i < n; i++) {
        //     snake[i].x = snake[i - 1].x - 2;
        // }
        snake.forEach(s => {
            s.dx = 0;
            s.dy = 0;
        })
    } else if (snake[0].x + snake[0].radius >= canvas.width) {
        // n = snake.length;
        // snake[0].x = snake[0].x - (2 * n - 1);
        // for (let i = 1; i < n; i++) {
        //     snake[i].x = snake[i - 1].x + 2;
        // }
        snake.forEach(s => {
            s.dx = 0;
            s.dy = 0;
        })
    }

    if (snake[0].y - snake[0].radius <= 0) {
        // n = snake.length;
        // snake[0].y = snake[0].y + (2 * n - 1)
        // for (let i = 1; i < n; i++) {
        //     snake[i].y = snake[i - 1].y - 2;
        // }
        snake.forEach(s => {
            s.dx = 0;
            s.dy = 0;
        })
    } else if (snake[0].y + snake[0].radius >= canvas.height) {
        // n = snake.length;
        // snake[0].y = snake[0].y - (2 * n - 1);
        // for (let i = 1; i < n; i++) {
        //     snake[i].y = snake[i - 1].y + 2;
        // }
        snake.forEach(s => {
            s.dx = 0;
            s.dy = 0;
        })
    }

    if (indexArray[0] == snake.length) {
        indexArray = indexArray.slice(1);
        // indctr = 0;
        movingDirection = movingDirectionArray[0];
        movingDirectionArray = movingDirectionArray.slice(1);
        if (movingDirectionArray.length === 0) isDirectionChanged = false;
        // movingDirection = keyPressed;
        // console.log(movingDirection)
        // restore_speed();
    }
}

init();
animate();