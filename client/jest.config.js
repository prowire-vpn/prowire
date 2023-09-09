const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {compilerOptions} = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  preset: 'react-native',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/*.test.ts(x)?',
    '<rootDir>/desktop/**/*.test.ts',
  ],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
  modulePaths: [compilerOptions.baseUrl],
  setupFiles: ['<rootDir>/src/test/setup.ts'],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', {isolatedModules: true}],
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
