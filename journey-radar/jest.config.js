module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/test/**/*.test.ts',
    '**/tests/**/*.test.ts',
    '**/test/**/*.spec.ts',
    '**/tests/**/*.spec.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)'
  ],
};


