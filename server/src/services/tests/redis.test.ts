import {
  setUpRedis,
  closeRedis,
  cacheSearch,
  getCacheSearch,
  deleteCacheSearch,
} from '../redis';
import { createRandomString } from '../../utils/utils';

beforeAll(async () => {
  await setUpRedis();
});

afterAll(() => {
  closeRedis();
});

describe('Caching search results', () => {
  const data = { test: 'test' };

  test('Caching search results should return true', async () => {
    const key = createRandomString(8);
    const results = await cacheSearch(key, data, 1);

    expect(results);
  });

  test('Getting results should return cache as object', async () => {
    const key = createRandomString(8);
    const page = 1;

    await cacheSearch(key, data, page);
    const results = await getCacheSearch(key, page);
    expect(results).toBeDefined();
    expect(results.test).toBe(data.test);
  });

  test('Deleting an existing cache should return true', async () => {
    const key = createRandomString(8);
    const page = 1;

    await cacheSearch(key, data, page);
    await getCacheSearch(key, page);
    const reply = await deleteCacheSearch(key);
    expect(reply).toBeTruthy();
  });
});
