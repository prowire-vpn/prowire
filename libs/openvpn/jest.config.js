const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {compilerOptions: {paths}} = require('./tsconfig.test.json');
const {compilerOptions: {baseUrl}} = require('./tsconfig.build.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.ts'],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(paths, {prefix: '<rootDir>/src'}),
  modulePaths: [baseUrl],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
