module.exports = {
  testEnvironment: 'detox/runners/jest/testEnvironment',
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testMatch: ['**/*.e2e.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
};
