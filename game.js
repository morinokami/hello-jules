class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 50;
        this.height = 30;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight - this.height - 10;
        this.color = 'white'; // This might be removed if drawing is separated
        this.speed = 7;
    }

    // draw(ctx) { // Drawing will be handled by main.js
    //     ctx.fillStyle = this.color;
    //     ctx.fillRect(this.x, this.y, this.width, this.height);
    // }

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

    // shoot() will be handled by the Game class, which will create a Bullet
}

class Bullet {
    constructor(x, y, speed) { // Color removed, will be handled by main.js if needed
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 15;
        // this.color = color; // Drawing detail
        this.speed = speed;
    }

    // draw(ctx) { // Drawing will be handled by main.js
    //     ctx.fillStyle = this.color;
    //     ctx.fillRect(this.x, this.y, this.width, this.height);
    // }

    update() {
        this.y -= this.speed;
    }
}

class Enemy {
    constructor(x, y, width, height) { // Color removed
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // this.color = color; // Drawing detail
    }

    // draw(ctx) { // Drawing will be handled by main.js
    //     ctx.fillStyle = this.color;
    //     ctx.fillRect(this.x, this.y, this.width, this.height);
    // }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.player = null;
        this.enemies = [];
        this.bullet = null;
        this.gameOver = false;
        this.gameWon = false;

        // Configuration for enemies - can be adjusted
        this.enemyRows = 3;
        this.enemyCols = 5;
        this.enemyWidth = 40;
        this.enemyHeight = 30;
        this.enemyPadding = 10;
        this.enemyOffsetTop = 30;
        this.enemyOffsetLeft = 30;
        this.enemySpeed = 1;
        this.enemyDirection = 1; // 1 for right, -1 for left
        
        this.initGame();
    }

    initGame() {
        this.gameOver = false;
        this.gameWon = false;
        this.player = new Player(this.gameWidth, this.gameHeight);
        this.bullet = null;
        this.enemies = [];
        this.enemyDirection = 1; // Reset direction

        for (let r = 0; r < this.enemyRows; r++) {
            for (let c = 0; c < this.enemyCols; c++) {
                let enemyX = c * (this.enemyWidth + this.enemyPadding) + this.enemyOffsetLeft;
                let enemyY = r * (this.enemyHeight + this.enemyPadding) + this.enemyOffsetTop;
                this.enemies.push(new Enemy(enemyX, enemyY, this.enemyWidth, this.enemyHeight));
            }
        }
    }

    // Player actions
    movePlayerLeft() {
        if (this.player) this.player.moveLeft();
    }

    movePlayerRight() {
        if (this.player) this.player.moveRight();
    }

    playerShoot() {
        if (this.player && !this.bullet) {
            // Bullet starts at the top-middle of the player
            let bulletX = this.player.x + this.player.width / 2 - 2.5; // 2.5 is bulletWidth/2
            let bulletY = this.player.y;
            this.bullet = new Bullet(bulletX, bulletY, 7); // Speed 7
        }
    }

    // Enemy updates
    updateEnemies() {
        if (this.gameOver || this.gameWon) return;

        let moveDown = false;

        for (const enemy of this.enemies) {
            if (this.enemyDirection === 1) { // Moving right
                if (enemy.x + enemy.width >= this.gameWidth) {
                    this.enemyDirection = -1;
                    moveDown = true;
                    break;
                }
            } else { // Moving left
                if (enemy.x <= 0) {
                    this.enemyDirection = 1;
                    moveDown = true;
                    break;
                }
            }
        }

        for (const enemy of this.enemies) {
            if (moveDown) {
                enemy.move(0, this.enemyHeight);
            }
            enemy.move(this.enemySpeed * this.enemyDirection, 0);

            if (enemy.y + enemy.height >= this.gameHeight) {
                this.gameOver = true;
                return;
            }
        }
    }

    // Bullet updates and collision detection
    updateBulletAndCollisions() {
        if (this.gameOver || this.gameWon) return;
        if (!this.bullet) return;

        this.bullet.update();

        // Bullet Off-Screen Check
        if (this.bullet.y + this.bullet.height < 0) {
            this.bullet = null;
            return;
        }

        // Collision with Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (this.bullet && // Ensure bullet still exists
                this.bullet.x < enemy.x + enemy.width &&
                this.bullet.x + this.bullet.width > enemy.x &&
                this.bullet.y < enemy.y + enemy.height &&
                this.bullet.y + this.bullet.height > enemy.y) {
                
                this.enemies.splice(i, 1);
                this.bullet = null;

                if (this.enemies.length === 0) {
                    this.gameWon = true;
                }
                return; 
            }
        }
    }

    // Game state checks
    isGameOver() {
        return this.gameOver;
    }

    isGameWon() {
        return this.gameWon;
    }

    // Getting game objects for rendering
    getPlayer() {
        return this.player;
    }

    getEnemies() {
        return this.enemies;
    }

    getBullet() {
        return this.bullet;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Game, Player, Enemy, Bullet };
} else {
    window.Game = Game;
    window.Player = Player;
    window.Enemy = Enemy;
    window.Bullet = Bullet;
}
