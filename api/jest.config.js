const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {compilerOptions} = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.test.ts'],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/src'}),
  modulePaths: [compilerOptions.baseUrl],
  setupFiles: ['<rootDir>/test/env.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/test/pki/setup.ts',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  runner: 'groups',
};
