module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 10000, // Aumenta o tempo limite global
    testMatch: ['**/__tests__/**/*.test.ts'], // Definir onde estão os testes
    moduleFileExtensions: ['ts', 'js'],
    setupFiles: ['dotenv/config'], // Carrega variáveis de ambiente
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Mapeamento opcional se usar aliases
    },
  };
  