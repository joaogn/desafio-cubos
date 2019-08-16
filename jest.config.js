module.exports = {
  collectCoverage: true,
  coverageDirectory: 'src/__tests__/coverage',
  bail: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/__tests__/coverage/**'
  ]
}
