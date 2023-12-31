// For a detailed explanation regarding each configuration property, visit: https://jestjs.io/docs/configuration
// Jest Version: 29.5.0
export default {
    automock: false,
    bail: 0,
    cacheDirectory: 'D:\\tmp\\jest_cache',
    clearMocks: false,
    collectCoverage: false,
    collectCoverageFrom: undefined,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageProvider: 'v8',
    coverageReporters: ['clover', 'json', 'lcov', 'text'],
    coverageThreshold: undefined,
    dependencyExtractor: undefined,
    displayName: 'Todo List',
    errorOnDeprecated: false,
    extensionsToTreatAsEsm: [],
    fakeTimers: {},
    forceCoverageMatch: [''],
    globals: {},
    globalSetup: undefined,
    globalTeardown: undefined,
    haste: undefined,
    injectGlobals: true,
    maxConcurrency: 5,
    maxWorkers: '50%',
    moduleDirectories: ['node_modules'],
    // moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
        '^@observers/(.*)$': '<rootDir>/src/observers/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@templates/(.*)$': '<rootDir>/src/templates/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1',
    },
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    modulePaths: [],
    notify: false,
    notifyMode: 'failure-change',
    openHandlesTimeout: 1000,
    preset: 'ts-jest',
    prettierPath: 'prettier',
    projects: undefined,
    randomize: false,
    reporters: undefined,
    resetMocks: false,
    resetModules: false,
    resolver: undefined,
    restoreMocks: false,
    rootDir: undefined,
    roots: ['<rootDir>'],
    runner: 'jest-runner',
    sandboxInjectedGlobals: undefined,
    setupFiles: ['./tests/setup.ts'],
    setupFilesAfterEnv: [],
    showSeed: false,
    slowTestThreshold: 5,
    snapshotFormat: {
        escapeString: false,
        printBasicPrototype: false,
    },
    snapshotResolver: undefined,
    snapshotSerializers: [],
    testEnvironment: 'node',
    testEnvironmentOptions: {},
    testFailureExitCode: 1,
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    testPathIgnorePatterns: ["/node_modules/"],
    testRegex: undefined,
    testResultsProcessor: undefined,
    testRunner: 'jest-circus/runner',
    testSequencer: '@jest/test-sequencer',
    testTimeout: 5000,
    transform: {},
    transformIgnorePatterns: [],
    unmockedModulePathPatterns: [],
    verbose: false,
    watchPathIgnorePatterns: [],
    watchPlugins: [],
    watchman: true,
    workerIdleMemoryLimit: undefined,
    '//': '',
    workerThreads: false,
}
