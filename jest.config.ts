import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  // You can use either "jsdom" or "jest-environment-jsdom"
  testEnvironment: "jsdom",
  // Or if you want to be explicit:
  // testEnvironment: 'jest-environment-jsdom',
  testMatch: ["**/tests/**/*.test.ts"],
};

export default config;
