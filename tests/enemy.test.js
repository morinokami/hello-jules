import { describe, it, expect, beforeEach } from 'vitest';
import { Enemy } from '../game.js'; // Adjust path if game.js is elsewhere

describe('Enemy', () => {
  let enemy;
  const initialX = 50;
  const initialY = 50;
  const width = 40;
  const height = 30;
  const color = 'green';

  beforeEach(() => {
    enemy = new Enemy(initialX, initialY, width, height, color);
  });

  it('should initialize with correct properties', () => {
    expect(enemy.x).toBe(initialX);
    expect(enemy.y).toBe(initialY);
    expect(enemy.width).toBe(width);
    expect(enemy.height).toBe(height);
    expect(enemy.color).toBe(color);
  });

  it('move should update x and y coordinates', () => {
    const dx = 5;
    const dy = 10;
    enemy.move(dx, dy);
    expect(enemy.x).toBe(initialX + dx);
    expect(enemy.y).toBe(initialY + dy);
  });

  it('move should correctly handle negative dx and dy', () => {
    const dx = -5;
    const dy = -10;
    enemy.move(dx, dy);
    expect(enemy.x).toBe(initialX + dx);
    expect(enemy.y).toBe(initialY + dy);
  });

  it('move should correctly handle zero dx and dy', () => {
    const dx = 0;
    const dy = 0;
    enemy.move(dx, dy);
    expect(enemy.x).toBe(initialX);
    expect(enemy.y).toBe(initialY);
  });
});
