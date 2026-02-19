const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '.module.(css|sass|scss)$': 'identity-obj-proxy'
    }
}

export default config