// jest.config.ts
import { pathsToModuleNameMapper } from 'ts-jest';
import fs from 'fs';
import path from 'path';

const tsconfig = JSON.parse(
  fs.readFileSync(path.resolve('./tsconfig.json'), 'utf8')
);

export default {
  preset: 'ts-jest/presets/default-esm',
  // transform: {
  //   '^.+\\.tsx?$': ['ts-jest', {
  //     useESM: true,
  //     tsconfig: './tsconfig.jest.json',
  //   }],
  // },
  // extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  modulePaths: [tsconfig.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
