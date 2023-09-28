const {pathsToModuleNameMapper, defaults} = require('ts-jest');
const {
  compilerOptions: {paths},
} = require('./tsconfig.test.json');
const {
  compilerOptions: {baseUrl},
} = require('./tsconfig.build.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...defaults,
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.test.ts'],
  roots: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(paths, {prefix: '<rootDir>/src'}),
  modulePaths: [baseUrl],
  setupFiles: ['<rootDir>/test/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/pki/setup.ts', '<rootDir>/test/utils/app.setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  runner: 'groups',
};
