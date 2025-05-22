document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Set canvas background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 50;
            this.height = 30;
            this.x = gameWidth / 2 - this.width / 2;
            this.y = gameHeight - this.height - 10;
            this.color = 'white';
            this.speed = 7;
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        moveLeft() {
            this.x -= this.speed;
            if (this.x < 0) {
                this.x = 0;
            }
        }

        moveRight() {
            this.x += this.speed;
            if (this.x > this.gameWidth - this.width) {
                this.x = this.gameWidth - this.width;
            }
        }

        shoot() {
            // if (!bullet) { // Check if a bullet already exists on screen
            //     let bulletX = this.x + this.width / 2 - 2.5; // Center bullet horizontally (2.5 is bulletWidth/2)
            //     let bulletY = this.y; // Bullet starts at the top of the player
            //     bullet = new Bullet(bulletX, bulletY, 'yellow', 7); // Create new bullet instance, assign to the global `bullet` variable
            //     // console.log('Player shoots'); // Can be removed or kept for debugging
            // }
            if (!bullet) { // Check if a bullet already exists on screen
                let bulletX = this.x + this.width / 2 - 2.5; // Center bullet horizontally (2.5 is bulletWidth/2)
                let bulletY = this.y; // Bullet starts at the top of the player
                bullet = new Bullet(bulletX, bulletY, 'yellow', 7); // Create new bullet instance, assign to the global `bullet` variable
            }
        }
    }

    function updateBulletAndCollisions() {
        if (!bullet) {
            return; // Do nothing if there's no bullet
        }

        bullet.update(); // Move the bullet upwards

        // Bullet Off-Screen Check
        if (bullet.y + bullet.height < 0) {
            bullet = null; // Remove bullet if it goes off the top of the screen
            return;
        }

        // Collision with Enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            // Simple Bounding Box Collision Check
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Collision detected
                enemies.splice(i, 1); // Remove the enemy
                bullet = null; // Remove the bullet
                // Optional: Add score update here
                // console.log("Enemy hit!");

                // Win Condition Check
                if (enemies.length === 0) {
                    gameWon = true;
                    // console.log("You Win!");
                }
                return; // Exit function since bullet is gone
            }
        }
    }

    class Bullet {
        constructor(x, y, color, speed) {
            this.x = x;
            this.y = y;
            this.width = 5;
            this.height = 15;
            this.color = color;
            this.speed = speed;
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            this.y -= this.speed;
        }
    }

    class Enemy {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        move(dx, dy) {
            this.x += dx;
            this.y += dy;
        }
    }

    // Game Variables
    let player;
    let enemies = [];
    let bullet; // To hold the single bullet object, initially null or undefined
    let enemyRows = 3;
    let enemyCols = 5;
    let enemyWidth = 40;
    let enemyHeight = 30;
    let enemyPadding = 10;
    let enemyOffsetTop = 30;
    let enemyOffsetLeft = 30;
    let enemySpeed = 1; // Horizontal speed for the enemy group
    let enemyDirection = 1; // 1 for right, -1 for left
    let gameOver = false;
    let gameWon = false;

    // Initialize game
    function init() {
        gameOver = false;
        gameWon = false;
        player = new Player(canvas.width, canvas.height);
        bullet = null; // Reset bullet
        enemies = []; // Clear existing enemies

        // Enemy Grid Creation
        for (let r = 0; r < enemyRows; r++) {
            for (let c = 0; c < enemyCols; c++) {
                let enemyX = c * (enemyWidth + enemyPadding) + enemyOffsetLeft;
                let enemyY = r * (enemyHeight + enemyPadding) + enemyOffsetTop;
                enemies.push(new Enemy(enemyX, enemyY, enemyWidth, enemyHeight, 'green'));
            }
        }
    }

    init(); // Call init to setup the game state

    // Input Handling
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        KeyA: false, // 'a'
        KeyD: false, // 'd'
        Space: false // ' ' (Spacebar)
    };

    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
        // Prevent default for spacebar if it's used for shooting to avoid page scroll
        if (e.code === 'Space') {
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });

    function handleInput() {
        if (keys.ArrowLeft || keys.KeyA) {
            player.moveLeft();
        }
        if (keys.ArrowRight || keys.KeyD) {
            player.moveRight();
        }
        if (keys.Space) {
            player.shoot();
        }
    }

    function updateEnemies() {
        let moveDown = false; // Flag to indicate if enemies should move down

        // Horizontal Movement and Edge Detection
        for (const enemy of enemies) {
            if (enemyDirection === 1) { // Moving right
                if (enemy.x + enemy.width >= canvas.width) {
                    enemyDirection = -1; // Change direction
                    moveDown = true;
                    break; // Stop checking other enemies for this frame, direction changed
                }
            } else { // Moving left (enemyDirection === -1)
                if (enemy.x <= 0) {
                    enemyDirection = 1; // Change direction
                    moveDown = true;
                    break; // Stop checking other enemies for this frame, direction changed
                }
            }
        }

        // Apply Movement
        for (const enemy of enemies) {
            if (moveDown) {
                enemy.move(0, enemyHeight); // Move down by one enemy height
            }
            enemy.move(enemySpeed * enemyDirection, 0); // Move horizontally

            // Lose Condition Check
            if (enemy.y + enemy.height >= canvas.height) {
                gameOver = true;
                // console.log("Game Over - Enemy reached bottom");
                return; // Exit early if game over
            }
        }
    }

    function draw() {
        // Clear and Background
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.fillStyle = 'black'; // Set background color
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill background

        // Draw Player
        player.draw(ctx);

        // Draw Bullet
        if (bullet) {
            bullet.draw(ctx);
        }

        // Draw Enemies
        enemies.forEach(enemy => enemy.draw(ctx));

        // Display Game Messages
        ctx.fillStyle = 'white';
        ctx.font = '45px Arial';
        if (gameOver) {
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        } else if (gameWon) {
            ctx.textAlign = 'center';
            ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
        }
    }

    function gameLoop() {
        // Check Game State
        if (gameOver || gameWon) {
            // If game is over or won, we still call draw one last time to show the message
            // then return to stop the loop.
            draw();
            return;
        }

        // Process Input
        handleInput();

        // Update Game State
        updateEnemies();
        // Need to check gameOver again after enemy update, as they might reach bottom
        if (gameOver) {
            draw();
            return;
        }
        updateBulletAndCollisions();
        // Need to check gameWon again after bullet collisions
        if (gameWon) {
            draw();
            return;
        }

        // Render
        draw();

        // Request Next Frame
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();
});
