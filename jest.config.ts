export default {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.json'
    }
  },
  testEnvironment: 'node',
  moduleDirectories: ['src', 'node_modules']
}
