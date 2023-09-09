const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {compilerOptions} = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  preset: 'react-native',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.ts(x)?'],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/src'}),
  modulePaths: [compilerOptions.baseUrl],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', {isolatedModules: true}],
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
