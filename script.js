const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Create the pong paddle
const paddleWidth = 10;
const paddleHeight = 100;

let player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
};

let computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
};

// Create the pong ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    velocityX: 4,
    velocityY: 4,
    color: 'white'
};

// Draw the rectangle
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Draw the circle
function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw the text
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = '35px Arial';
    context.fillText(text, x, y);
}

// Update function
function update() {
    // Move the paddle
    if (upPressed && player.y > 0) {
        player.y -= 8;
    }
    if (downPressed && (player.y < canvas.height - player.height)) {
        player.y += 8;
    }

    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Collision with paddles
    let paddle = (ball.x < canvas.width / 2) ? player : computer;
    if (collision(ball, paddle)) {
        // Ball collided with paddle
        ball.velocityX = -ball.velocityX;
    }

    // Reset ball if it goes out of bounds
    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
}

// Reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
}

// Collision detection
function collision(ball, paddle) {
    return ball.x - ball.radius < paddle.x + paddle.width &&
           ball.x + ball.radius > paddle.x &&
           ball.y - ball.radius < paddle.y + paddle.height &&
           ball.y + ball.radius > paddle.y;
}

// Draw everything
function draw() {
    drawRect(0, 0, canvas.width, canvas.height, 'black'); // Clear the canvas
    drawRect(player.x, player.y, player.width, player.height, player.color); // Draw player paddle
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color); // Draw computer paddle
    drawCircle(ball.x, ball.y, ball.radius, ball.color); // Draw ball
    drawText(player.score, canvas.width / 4, canvas.height / 5, 'white'); // Draw player score
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, 'white'); // Draw computer score
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Control the player paddle
let upPressed = false;
let downPressed = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    }
    if (event.key === 'ArrowDown') {
        downPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    }
    if (event.key === 'ArrowDown') {
        downPressed = false;
    }
});

// Start the game loop
gameLoop();
