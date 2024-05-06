export default {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.mjs'],
    moduleFileExtensions: ['js', 'mjs', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.test.mjs'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    transform: {
      '\\.[jt]sx?$': 'babel-jest',
      '\\.mjs$': 'babel-jest'
    }
  };
  