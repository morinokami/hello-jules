const { defineConfig } = require('vitest/config');

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
