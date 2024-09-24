const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Paddle settings
const paddleWidth = 10;
const paddleHeight = 100;

// Player 1 (left) settings
let player1 = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
};

// Player 2 (right) settings
let player2 = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
};

// Ball settings
let initialBallSpeed = 30; // Starta med högre hastighet
const ballSpeedIncrement = 10; // Öka hastigheten med större steg
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: initialBallSpeed,
    velocityX: 30, // Starta med högre hastighet
    velocityY: 30, // Starta med högre hastighet
    color: 'white',
    playerHits: 0 // To track the number of hits by both players
};

// Function to draw paddles (rectangles)
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Function to draw the ball (circle)
function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Function to draw text (score)
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = '35px Arial';
    context.fillText(text, x, y);
}

// Update game state (ball movement, paddle movement)
function update() {
    // Move Player 1 (W and S controls)
    if (wPressed && player1.y > 0) {
        player1.y -= 8;
    }
    if (sPressed && player1.y < canvas.height - player1.height) {
        player1.y += 8;
    }

    // Move Player 2 (Arrow Up and Down controls)
    if (upPressed && player2.y > 0) {
        player2.y -= 8;
    }
    if (downPressed && player2.y < canvas.height - player2.height) {
        player2.y += 8;
    }

    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball collision with paddles
    let paddle = (ball.x < canvas.width / 2) ? player1 : player2;
    if (collision(ball, paddle)) {
        ball.velocityX = -ball.velocityX;

        // Modify ball's Y velocity based on where it hits the paddle
        let deltaY = ball.y - (paddle.y + paddle.height / 2);
        deltaY = deltaY / (paddle.height / 2); // Normalize deltaY between -1 and 1
        ball.velocityY = deltaY * ball.speed; // More dramatic angle changes

        // Increase the number of player hits
        ball.playerHits += 1;

        // Increase ball speed after both players have hit the ball
        if (ball.playerHits % 2 === 0) {
            ball.speed += ballSpeedIncrement;
            ball.velocityX = ball.velocityX > 0 ? ball.speed : -ball.speed;
            ball.velocityY = ball.velocityY > 0 ? ball.speed : -ball.speed;
        }
    }

    // Reset the ball if it goes out of bounds
    if (ball.x - ball.radius < 0) {
        player2.score++;
        if (player2.score === 10) {
            endGame("Player 2 Wins!");
        } else {
            resetBall();
        }
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        if (player1.score === 10) {
            endGame("Player 1 Wins!");
        } else {
            resetBall();
        }
    }
}

// Reset ball to center after scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = initialBallSpeed;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = ball.speed;
    ball.playerHits = 0; // Reset hit count
}

// End the game and display "New Match" button
function endGame(winnerText) {
    // Stop game loop
    cancelAnimationFrame(gameLoopId);
    
    // Display winner and "New Match" button
    drawText(winnerText, canvas.width / 2 - 100, canvas.height / 2, 'white');
    
    // Create "New Match" button
    const button = document.createElement('button');
    button.innerText = "Ny match";
    button.style.position = 'absolute';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '10px 20px';
    button.style.fontSize = '20px';
    button.style.backgroundColor = 'white';
    button.style.color = 'black';
    button.onclick = () => {
        // Reset scores and ball speed
        player1.score = 0;
        player2.score = 0;
        ball.speed = initialBallSpeed;
        resetBall();

        // Remove the button
        document.body.removeChild(button);
        
        // Restart the game loop
        gameLoopId = requestAnimationFrame(gameLoop);
    };
    
    document.body.appendChild(button);
}

// Collision detection between ball and paddle
function collision(ball, paddle) {
    return ball.x - ball.radius < paddle.x + paddle.width &&
           ball.x + ball.radius > paddle.x &&
           ball.y - ball.radius < paddle.y + paddle.height &&
           ball.y + ball.radius > paddle.y;
}

// Draw everything
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    
    // Draw paddles and ball
    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color); // Player 1 paddle (left)
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color); // Player 2 paddle (right)
    drawCircle(ball.x, ball.y, ball.radius, ball.color); // Ball

    // Draw scores
    drawText(player1.score, canvas.width / 4, canvas.height / 5, 'white'); // Player 1 score
    drawText(player2.score, 3 * canvas.width / 4, canvas.height / 5, 'white'); // Player 2 score
}

// Game loop (update and draw)
let gameLoopId;
function gameLoop() {
    update();
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Variables to track keypresses
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// Event listeners for keydown
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w':
            wPressed = true;
            break;
        case 's':
            sPressed = true;
            break;
        case 'ArrowUp':
            upPressed = true;
            break;
        case 'ArrowDown':
            downPressed = true;
            break;
    }
});

// Event listeners for keyup
document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'w':
            wPressed = false;
            break;
        case 's':
            sPressed = false;
            break;
        case 'ArrowUp':
            upPressed = false;
            break;
        case 'ArrowDown':
            downPressed = false;
            break;
    }
});

// Start the game loop
gameLoop();
