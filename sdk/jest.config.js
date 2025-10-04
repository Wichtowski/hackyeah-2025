/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Look for integration tests under test/ or __tests__
  testMatch: ['**/test/**/*.test.ts', '**/__tests__/**/*.test.ts'],
  // Increase timeout a bit for starting backend server
  testTimeout: 15000,
  verbose: true,
};

