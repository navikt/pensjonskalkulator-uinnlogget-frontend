const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  collectCoverage: process.argv.includes('--c'),
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!babel-jest.config.js',
    '!jest.config.js',
    '!next-env.d.ts',
    '!postcss.config.js',
    '!tailwind.config.js',
    '!**/.next/**',
    '!block-navigation.js',
    '!prettify.js',
    '!sorter.js',
    '!src/types/**',
    '!src/app/page.tsx',
    '!src/common.d.ts',
    '!src/text/errors.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    'babel-jest.config.js',
    'jest.config.js',
    'next-env.d.ts',
    'postcss.config.js',
    'tailwind.config.js',
    'block-navigation.js',
    'prettify.js',
    'sorter.js',
    'src/types/',
    'src/texts/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: './babel-jest.config.js' },
    ],
  },
  transformIgnorePatterns: ['/node_modules/'],
}

module.exports = createJestConfig(customJestConfig)
