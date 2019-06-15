const config = require('../e2e/setup/test_config');

module.exports = {
  verbose: true,
  rootDir: '../',
  testMatch: [
    '<rootDir>/e2e/**/*.test.js',
  ],
  globals: {
    __CUSTOM_CONFIG__: {
      credentials: config.credentials,
      endpoint: config.endpoint,
    },
  },
  globalSetup: '<rootDir>/e2e/setup/setup.js',
  globalTeardown: '<rootDir>/e2e/setup/teardown.js',
  testEnvironment: '<rootDir>/e2e/setup/puppeteer_environment.js',
  setupFilesAfterEnv: [
    '<rootDir>/e2e/setup/jestSetup.js',
  ],
};
