'use strict';

module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageThreshold: {
    global: { statements: 60, branches: 50, functions: 60, lines: 60 },
  },
};
