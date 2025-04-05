// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Use jsdom to simulate the browser
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Set up Jest DOM matchers
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock styles
        '^@/(.*)$': '<rootDir>/src/$1', // If you have path aliases in tsconfig.json
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest for TypeScript files
        '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest for JS/JSX files
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@some-package|another-package)/)', // Handle certain node_modules with custom transform
    ],
};

export default config;
