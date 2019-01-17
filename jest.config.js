'use strict';

module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: '.+\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],

  coverageDirectory: './coverage/',
  collectCoverage: true
};
