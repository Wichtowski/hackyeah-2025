module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/test/**/*.test.ts',
    '**/tests/**/*.test.ts',
    '**/test/**/*.spec.ts',
    '**/tests/**/*.spec.ts'
  ],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@adapter/(.*)$': '<rootDir>/src/adapter/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)'
  ],
};
