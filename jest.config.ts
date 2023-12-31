/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/"],
  testTimeout: 20000, // Set the default timeout for all tests to 10000 ms
};
