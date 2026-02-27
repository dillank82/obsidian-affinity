const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
  }
}

export default config