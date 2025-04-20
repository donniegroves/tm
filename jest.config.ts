import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

const config: Config = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "<rootDir>/"],
    moduleNameMapper: {
        // These paths should always match the paths in tsconfig.json
        "^@/app/(.*)$": "<rootDir>/app/$1",
        "^@/components/(.*)$": "<rootDir>/app/components/$1",
        "^@/utils/(.*)$": "<rootDir>/utils/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
