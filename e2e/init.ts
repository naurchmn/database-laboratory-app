import detox from 'detox';
import adapter from 'detox/runners/jest/adapter';

const config = require('../package.json').detox;

jest.setTimeout(120000);

beforeAll(async () => {
  await detox.init(config, { initGlobals: true });
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterEach(async () => {
  await adapter.afterEach();
});

afterAll(async () => {
  await detox.cleanup();
});
