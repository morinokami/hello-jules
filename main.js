document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Create game instance (assuming Game class from game.js is available)
    // For a real browser environment without a module bundler, game.js would need to be included
    // before main.js in index.html, and its classes would be globally accessible or attached to a global object.
    // E.g., const { Game } = window.GameModule; if game.js did window.GameModule = { Game, ... };
    // For now, we'll proceed as if `Game` is directly available.
    const game = new Game(canvas.width, canvas.height); // Game class from game.js

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
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scroll
            game.playerShoot(); // Player shoot action through Game class
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });

    function handleInput() {
        if (keys.ArrowLeft || keys.KeyA) {
            game.movePlayerLeft();
        }
        if (keys.ArrowRight || keys.KeyD) {
            game.movePlayerRight();
        }
        // Shooting is handled on keydown for responsiveness
    }
    
    // Drawing functions
    function drawPlayer(player) {
        if (!player) return;
        ctx.fillStyle = 'white'; // Player color
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawBullet(bullet) {
        if (!bullet) return;
        ctx.fillStyle = 'yellow'; // Bullet color
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    function drawEnemies(enemies) {
        ctx.fillStyle = 'green'; // Enemy color
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawGameMessages() {
        ctx.fillStyle = 'white';
        ctx.font = '45px Arial';
        ctx.textAlign = 'center';

        if (game.isGameOver()) {
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        } else if (game.isGameWon()) {
            ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
        }
    }

    function draw() {
        // Clear and Background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get game objects from Game instance
        const player = game.getPlayer();
        const enemies = game.getEnemies();
        const bullet = game.getBullet();

        // Draw game elements
        drawPlayer(player);
        drawEnemies(enemies);
        drawBullet(bullet);
        
        // Display Game Messages
        drawGameMessages();
    }

    function gameLoop() {
        // Check Game State first
        if (game.isGameOver() || game.isGameWon()) {
            draw(); // Draw final state (Game Over or You Win message)
            return; // Stop the loop
        }

        // Process Input
        handleInput();

        // Update Game State using Game instance methods
        game.updateEnemies();
        // Check game over again after enemy update (e.g., enemies reached bottom)
        if (game.isGameOver()) {
            draw();
            return;
        }

        game.updateBulletAndCollisions();
        // Check game won again after bullet collisions (e.g., all enemies defeated)
        if (game.isGameWon()) {
            draw();
            return;
        }
        
        // Render
        draw();

        // Request Next Frame
        requestAnimationFrame(gameLoop);
    }

    // Initialize the game (already done by game constructor) and start the loop
    // game.initGame(); // This is called within the Game constructor
    gameLoop();
});
