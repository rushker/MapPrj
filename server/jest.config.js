// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^@turf/turf$': '<rootDir>/node_modules/@turf/turf/turf.js'
  },
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 10000
};