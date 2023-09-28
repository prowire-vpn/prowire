const base = require('./jest.config');

module.exports = {
  ...base,
  setupFiles: ['<rootDir>/test/env.integration.ts'],
};
