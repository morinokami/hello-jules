import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../game.js'; // Adjust path if game.js is elsewhere

describe('Player', () => {
  let player;
  const gameWidth = 800;
  const gameHeight = 600;

  beforeEach(() => {
    // Pass dummy gameWidth and gameHeight for testing
    player = new Player(gameWidth, gameHeight);
  });

  it('should initialize with correct properties', () => {
    expect(player.gameWidth).toBe(gameWidth);
    expect(player.gameHeight).toBe(gameHeight);
    expect(player.width).toBe(50); // Assuming default width
    expect(player.height).toBe(30); // Assuming default height
    expect(player.x).toBe(gameWidth / 2 - player.width / 2);
    expect(player.y).toBe(gameHeight - player.height - 10);
    expect(player.speed).toBe(7); // Assuming default speed
    expect(player.color).toBeDefined(); // Or a specific color if important
  });

  it('moveLeft should decrease x position by speed', () => {
    const initialX = player.x;
    player.moveLeft();
    expect(player.x).toBe(initialX - player.speed);
  });

  it('moveLeft should not move player beyond left boundary', () => {
    player.x = 0; // Position player at the boundary
    player.moveLeft();
    expect(player.x).toBe(0);
  });

  it('moveLeft should handle moving close to left boundary', () => {
    player.x = player.speed / 2; // Position player close to boundary
    player.moveLeft();
    expect(player.x).toBe(0); // Should snap to boundary if movement overshoots
  });

  it('moveRight should increase x position by speed', () => {
    const initialX = player.x;
    player.moveRight();
    expect(player.x).toBe(initialX + player.speed);
  });

  it('moveRight should not move player beyond right boundary', () => {
    player.x = gameWidth - player.width; // Position player at the boundary
    player.moveRight();
    expect(player.x).toBe(gameWidth - player.width);
  });

  it('moveRight should handle moving close to right boundary', () => {
    player.x = gameWidth - player.width - player.speed / 2; // Position player close to boundary
    player.moveRight();
    expect(player.x).toBe(gameWidth - player.width); // Should snap to boundary
  });

  // shoot() method in Player class from original main.js creates a global bullet.
  // The refactored Game class's playerShoot() is likely a better place to test bullet creation.
  // If Player.shoot() itself still has logic (e.g., setting a flag or returning a new Bullet instance
  // without relying on a global), it could be tested here.
  // For now, assuming the core bullet creation logic is in Game.playerShoot().
  // If Player.shoot() was refactored to, for example, return a new Bullet object:
  /*
  it('shoot should return a new Bullet instance if no bullet active', () => {
    // This test depends on how Player.shoot and Bullet are structured post-refactor.
    // And how the Game class manages the bullet.
    // If Player.shoot() now directly returns a bullet:
    // const bullet = player.shoot();
    // expect(bullet).toBeInstanceOf(Bullet); // Need to import Bullet
    // expect(bullet.x).toBe(player.x + player.width / 2 - bullet.width / 2);
    // expect(bullet.y).toBe(player.y);
  });
  */
  // If Player.shoot() in game.js was simplified to just set a state for the Game class to handle,
  // then this test might not be relevant for the Player class directly.
  // The original Player.shoot() in main.js did: `bullet = new Bullet(...)`.
  // The refactored Player.shoot() in game.js (as per current context of game.js Player class)
  // still has this direct bullet creation logic. This creates a dependency on a global `bullet` variable
  // or expects `Bullet` to be defined in its scope.

  // Let's assume the Player.shoot() in game.js was refactored to be independent of a global `bullet`
  // and instead, it signals the Game class, or the Game.playerShoot() handles bullet creation.
  // If the Player class's shoot method itself is supposed to create a bullet, it should return it.
  // The provided game.js Player class has:
  // shoot() {
  //   if (!bullet) { // This `bullet` is problematic for encapsulation
  //     let bulletX = this.x + this.width / 2 - 2.5;
  //     let bulletY = this.y;
  //     bullet = new Bullet(bulletX, bulletY, 'yellow', 7); // Global `bullet`
  //   }
  // }
  // This needs to be tested carefully or further refactored in `game.js`.
  // For now, let's test this behavior as it is, assuming Bullet is available.
  // This will require `Bullet` to be imported and the global `bullet` to be managed or mocked.

  // Given the current structure of Player.shoot() in the original code (and likely game.js)
  // it manipulates a global-like `bullet` variable. This is hard to test in isolation.
  // The Game.playerShoot() is the one that should be tested for bullet creation.
  // We will skip testing Player.shoot() directly for now, as its current implementation
  // in `game.js` (if it mirrors the original `main.js` `Player.shoot`) is not well-suited for unit testing
  // without also managing/mocking the `bullet` variable it tries to assign globally.
  // The test for shooting will be more robust in `game.test.js` via `Game.playerShoot()`.
});
