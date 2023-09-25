const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {compilerOptions: {paths}} = require('./tsconfig.test.json');
const {compilerOptions: {baseUrl, path: buildPaths}} = require('./tsconfig.build.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.ts(x)?'],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper({...paths, ...buildPaths}, {prefix: '<rootDir>/src'}),
  modulePaths: [baseUrl],
  setupFilesAfterEnv: ['<rootDir>/test/mocks/localStorage.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
    '^.+\\.svg$': 'jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules\/(?!pretty-bytes)'],
  testTimeout: 10_000,
};
