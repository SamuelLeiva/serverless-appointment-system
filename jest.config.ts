import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // usa ts-jest para compilar TS
  testEnvironment: 'node', // entorno de ejecución
  roots: ['<rootDir>/src', '<rootDir>/tests'], // carpeta base de tu código
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'], // archivos de test
  clearMocks: true, // limpia mocks automáticamente entre tests
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
  // Opcional: para alias de paths de tsconfig.json
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
