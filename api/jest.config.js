const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {compilerOptions} = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  preset: 'ts-jest',
  testEnvironment: '<rootDir>/test/mongo/environment.ts',
  testMatch: ['<rootDir>/**/*.test.ts'],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/src'}),
  modulePaths: [compilerOptions.baseUrl],
  setupFiles: ['<rootDir>/test/env.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/test/mongo/setup.ts',
    '<rootDir>/test/pki/setup.ts',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
