import { describe, it, expect, beforeEach } from 'vitest';
import { Game, Enemy, Bullet, Player } // Assuming Bullet and Player might not be directly needed for these specific tests
from '../game.js';   // but Game will use them internally.

describe('Game State Management', () => {
  let game;
  const gameWidth = 800;
  const gameHeight = 600;

  beforeEach(() => {
    game = new Game(gameWidth, gameHeight);
    // The Game constructor calls initGame, which sets up enemies.
    // For some tests, we might want to clear or control this.
  });

  it('should initialize with a grid of enemies', () => {
    // game.initGame() is called by constructor.
    // Default enemyRows = 3, enemyCols = 5 in the original main.js (and thus in Game.js)
    const expectedEnemyCount = game.enemyRows * game.enemyCols; // Make sure these props exist on Game or get them from where they are defined
    expect(game.enemies.length).toBe(expectedEnemyCount);
    expect(game.isGameOver()).toBe(false);
    expect(game.isGameWon()).toBe(false);
  });

  it('should set gameWon to true when all enemies are destroyed', () => {
    expect(game.isGameWon()).toBe(false);
    game.enemies = []; // Manually clear enemies for this test
    
    // The win condition is typically checked after a collision that removes an enemy.
    // So, calling updateBulletAndCollisions (which checks win condition if an enemy is hit)
    // or a dedicated checkWinCondition method if it exists.
    // In the refactored Game class, updateBulletAndCollisions sets gameWon = true.
    // If we manually set enemies to [], we also need to manually set gameWon or simulate the condition that does.
    // For simplicity, let's assume there's a check or the condition is updated.
    // If updateBulletAndCollisions is the only place, we'd need a bullet and an enemy.
    
    // Let's test the scenario as it would happen:
    // Add one enemy, then simulate it being hit.
    game.initGame(); // Reset to default state
    // game.enemies = [new Enemy(50, 50, 40, 30, 'green')]; // Start with one enemy
    // Corrected: Enemy constructor in game.js is (x, y, width, height)
    game.enemies = [new Enemy(50, 50, 40, 30)]; 
    expect(game.enemies.length).toBe(1);

    // Create a bullet that will hit the enemy
    const enemy = game.enemies[0];
    // game.bullet = { // Mock bullet or use Bullet class
    //   x: enemy.x + enemy.width / 2 - 2.5, // Assuming bullet width 5
    //   y: enemy.y + enemy.height / 2 - 7.5, // Assuming bullet height 15
    //   width: 5,
    //   height: 15,
    //   speed: 0, // No need to move for this test, just needs to be there for collision
    //   update: () => {}, // Mock update
    //   draw: () => {}   // Mock draw
    // };
    // Use actual Bullet instance for more accurate testing
    // Bullet constructor (x, y, speed)
    game.bullet = new Bullet(
        enemy.x + enemy.width / 2 - 2.5, // bullet default width is 5
        enemy.y + enemy.height / 2 - 7.5, // bullet default height is 15
        0 // speed 0 is fine for collision test
    );
    
    game.updateBulletAndCollisions(); // This will remove the enemy and set gameWon

    expect(game.isGameWon()).toBe(true);
    expect(game.isGameOver()).toBe(false); // Should not be game over if won
  });

  it('should set gameOver to true if an enemy reaches the bottom', () => {
    expect(game.isGameOver()).toBe(false);
    game.initGame(); // Reset
    game.enemies = []; // Clear default enemies

    // Add one enemy positioned near the bottom
    // const enemy = new Enemy(50, gameHeight - 30, 40, 30, 'green'); // x, y, width, height
    // Corrected: Enemy constructor in game.js is (x, y, width, height)
    const enemy = new Enemy(50, gameHeight - 30, 40, 30);
    game.enemies.push(enemy);

    // Manually set its y to be at or below gameHeight - enemy.height
    // The check in updateEnemies is `enemy.y + enemy.height >= canvas.height` (i.e. game.gameHeight)
    // So let's make it exactly trigger that.
    enemy.y = game.gameHeight - enemy.height;

    game.updateEnemies(); // This method should detect enemy reaching bottom and set gameOver

    expect(game.isGameOver()).toBe(true);
    expect(game.isGameWon()).toBe(false); // Should not be game won if game over
  });
  
  it('playerShoot should create a bullet if no bullet exists', () => {
    game.initGame(); // Ensure player exists
    game.bullet = null; // No bullet initially
    game.playerShoot();
    expect(game.bullet).not.toBeNull();
    expect(game.bullet).toBeInstanceOf(Bullet); // If Bullet is imported
    expect(game.bullet.x).toBe(game.player.x + game.player.width / 2 - game.bullet.width / 2);
    expect(game.bullet.y).toBe(game.player.y);
  });

  it('playerShoot should not create a new bullet if one already exists', () => {
    game.initGame();
    game.playerShoot(); // First bullet
    const firstBullet = game.bullet;
    game.playerShoot(); // Attempt to shoot again
    expect(game.bullet).toBe(firstBullet); // Should be the same bullet instance
  });

  // Test player movement via Game class methods
  it('movePlayerLeft should move player left within boundaries', () => {
    game.initGame();
    const initialPlayerX = game.player.x;
    game.movePlayerLeft();
    if (initialPlayerX > 0) {
      expect(game.player.x).toBeLessThan(initialPlayerX);
    } else {
      expect(game.player.x).toBe(0);
    }
    game.player.x = 0;
    game.movePlayerLeft();
    expect(game.player.x).toBe(0); // Stays at boundary
  });

  it('movePlayerRight should move player right within boundaries', () => {
    game.initGame();
    const initialPlayerX = game.player.x;
    const playerMaxX = game.gameWidth - game.player.width;
    game.movePlayerRight();
    if (initialPlayerX < playerMaxX) {
      expect(game.player.x).toBeGreaterThan(initialPlayerX);
    } else {
      expect(game.player.x).toBe(playerMaxX);
    }
    game.player.x = playerMaxX;
    game.movePlayerRight();
    expect(game.player.x).toBe(playerMaxX); // Stays at boundary
  });

});
