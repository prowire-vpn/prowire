const base = require('./jest.config')

module.exports = {
  ...base,
  setupFilesAfterEnv: ["<rootDir>/test/env.integration.ts"],
}
