module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$', // Unitários: *.spec.ts
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.(t|j)s',
    '!**/*.dto.(t|j)s',
    '!**/main.(t|j)s',
    '!**/domain/models/**',
    '!**/infrastructure/database/entities/**',
    '!**/infrastructure/database/migrations/**',
    '!**/infrastructure/database/repositories/**',
    '!**/infrastructure/search/interfaces/**',
    '!**/infrastructure/search/pgvector/**',
    '!**/seeds/**',
    '!**/artifacts/artifacts.service.(t|j)s',
    '!**/interfaces/http/decorators/**',
    '!**/types.(t|j)s',
    '!**/*.dictionary.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
