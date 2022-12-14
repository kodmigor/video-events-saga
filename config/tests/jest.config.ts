export default {
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
      tsconfig: '<rootDir>/config/tests/tsconfig.json'
    }
  },
  preset: 'ts-jest',
  setupFiles: [
    '<rootDir>/config/tests/jest-ts-auto-mock-setup.ts'
  ],
  rootDir: '../../',
  // testEnvironment: 'node',
  testEnvironment: 'jsdom',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  transform: {
    '.+(ts|tsx)': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/src/test-utils/style-mock.ts'
  }
}
