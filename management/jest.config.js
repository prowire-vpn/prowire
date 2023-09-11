const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {compilerOptions} = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.ts(x)?'],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/src'}),
  modulePaths: [compilerOptions.baseUrl],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
    "^.+\\.svg$": "jest-transform-stub"
  }
};
