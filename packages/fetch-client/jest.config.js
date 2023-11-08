/* eslint-disable prettier/prettier */
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    // moduleFileExtensions: ["ts"],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testMatch: ["**/tests/unit/*.test.ts"],
}
