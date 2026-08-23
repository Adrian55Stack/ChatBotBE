export default {
    "testEnvironment": "node",
    "collectCoverageFrom": [
        "src/**/*.ts",
        "!tests/**/*.test.js"
    ],
    "coverageReporters": [
        "lcov",
        "text",
        "html"
    ],
    "coverageDirectory": "coverage",
    "coverageThreshold": {
        "global": {
            "lines": 80,
            "functions": 80,
            "branches": 80,
            "statements": 80
        }
    }
}