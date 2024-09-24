const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const netWidth = 2, netHeight = 10;
let upArrowPressed = false, downArrowPressed = false;
let wPressed = false, sPressed = false;
let leftPlayerScore = 0, rightPlayerScore = 0;
const winningScore = 10;
let gameOver = false;

let initialBallSpeed = 12; 
const ballSpeedIncrement = 2; 
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: initialBallSpeed,
    velocityX: 12, 
    velocityY: 12, 
    color: 'white',
    playerHits: 0
};

let leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0,
    dy: 8
};

let rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0,
    dy: 8
};

const newGameButton = document.getElementById("newGameButton");

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight, 'white');
    }
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "50px sans-serif";
    context.fillText(text, x, y);
}

function movePaddles() {
    if (wPressed && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.dy;
    } else if (sPressed && leftPaddle.y < canvas.height - leftPaddle.height) {
        leftPaddle.y += leftPaddle.dy;
    }

    if (upArrowPressed && rightPaddle.y > 0) {
        rightPaddle.y -= rightPaddle.dy;
    } else if (downArrowPressed && rightPaddle.y < canvas.height - rightPaddle.height) {
        rightPaddle.y += rightPaddle.dy;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = initialBallSpeed;
    ball.velocityX = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.velocityY = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Kollisionsdetektering mot kanterna
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Kollisionsdetektering med paddlar
    let paddle = (ball.x < canvas.width / 2) ? leftPaddle : rightPaddle;

    if (collision(ball, paddle)) {
        ball.velocityX = -ball.velocityX;

        let deltaY = ball.y - (paddle.y + paddle.height / 2);
        deltaY = deltaY / (paddle.height / 2);
        ball.velocityY = deltaY * ball.speed;

        ball.speed += ballSpeedIncrement;
        ball.velocityX = ball.velocityX > 0 ? ball.speed : -ball.speed;
        ball.velocityY = ball.velocityY > 0 ? Math.abs(ball.velocityY) : -Math.abs(ball.velocityY);
    }

    // Poängräkning
    if (ball.x - ball.radius < 0) {
        rightPaddle.score++;
        resetBall();
        checkGameOver();
    } else if (ball.x + ball.radius > canvas.width) {
        leftPaddle.score++;
        resetBall();
        checkGameOver();
    }
}

function collision(ball, paddle) {
    return ball.x < paddle.x + paddle.width &&
           ball.x + ball.radius > paddle.x &&
           ball.y < paddle.y + paddle.height &&
           ball.y + ball.radius > paddle.y;
}

function checkGameOver() {
    if (leftPaddle.score === winningScore || rightPaddle.score === winningScore) {
        gameOver = true;
        newGameButton.style.display = 'block';
    }
}

function resetGame() {
    leftPaddle.score = 0;
    rightPaddle.score = 0;
    gameOver = false;
    newGameButton.style.display = 'none';
    resetBall();
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawNet();
    drawText(leftPaddle.score, canvas.width / 4, canvas.height / 5, 'white');
    drawText(rightPaddle.score, 3 * canvas.width / 4, canvas.height / 5, 'white');

    if (!gameOver) {
        drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
        drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color);
        drawCircle(ball.x, ball.y, ball.radius, ball.color);
    }
}

function gameLoop() {
    if (!gameOver) {
        movePaddles();
        updateBall();
    }
    draw();
}

newGameButton.addEventListener('click', resetGame);

window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            upArrowPressed = true;
            break;
        case 'ArrowDown':
            downArrowPressed = true;
            break;
        case 'w':
            wPressed = true;
            break;
        case 's':
            sPressed = true;
            break;
    }
});

window.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            upArrowPressed = false;
            break;
        case 'ArrowDown':
            downArrowPressed = false;
            break;
        case 'w':
            wPressed = false;
            break;
        case 's':
            sPressed = false;
            break;
    }
});

setInterval(gameLoop, 1000 / 60);
