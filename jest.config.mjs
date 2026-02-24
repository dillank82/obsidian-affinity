const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    transform: {
        ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
    }
}

export default config