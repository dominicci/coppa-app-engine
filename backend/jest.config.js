module.exports = {
  testRegex: '(\\.(test|spec))\\.js$',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '**/node_modules'],
  testPathIgnorePatterns: ['/node_modules/', '/.cache/'],
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/serverless/index.js',
    '!**/**.io.**',
    '!index.js',
    '!sls.js',
    '!**/**jest.**',
  ],
  coverageReporters: ["json", "lcov", "text-summary"],
}
