import redis, { RedisClientType } from 'redis';
import logger from './logger';

let redisClient: RedisClientType | null;

/**
 * Creates a connection to redis server. Will prioritize URL over host and port.
 * @param {String} HOST Hostname for redis
 * @param {Number} PORT Port for redis
 * @param {String|Null} URL URL for redis conection.
 * @return {Promise<Object>} Returns a promise to resolve with a redis client
 *  when it's ready.
 */
export async function setUpRedis(
  HOST = 'localhost',
  PORT = 6379,
  URL: string | undefined = undefined,
): Promise<RedisClientType> {
  redisClient = redis.createClient({ url: URL });

  try {
    await redisClient.connect();
    logger.info(`Redis connection made on ${HOST}:${PORT}`);
    return redisClient;
  } catch (err) {
    logger.error('Redis connection error,');
    throw err;
  }
}

/**
 * Closes connection to redis.
 */
export function closeRedis(): void {
  if (redisClient) redisClient.quit();
}

/**
 * Stores value stringified to provided key with a TTL of 1 day.
 * @param {String} key Key to store value under
 * @param {Object} value Search results to cache
 * @param {Number} page Page number for search results
 * @return {Promise<Boolean>} Returns a promise to resolve with a boolean
 *  indicating if cache was set.
 */
export async function cacheSearch(
  key: string,
  value: Record<string, unknown>,
  page: number,
): Promise<boolean> {
  if (!redisClient) throw new Error('Redis is not initialized.');
  `page-${page}`;
  const reply = await redisClient.hSet(
    key,
    `page-${page}`,
    JSON.stringify(value),
  );
  if (reply === 0) return false;

  const ttl = await redisClient.ttl(key);
  if (ttl) redisClient.expire(key, 60 * 60 * 24);
  return true;
}

/**
 * Finds and returns cache of search results.
 * @param {Stirng} key Key of cache to get
 * @param {Number} page Page number of result
 * @returns {Promise<Object>} Returns a promise to resolve with json object
 *  of the cached results.
 */
export async function getCacheSearch(
  key: string,
  page: number,
): Promise<Record<string, unknown>> {
  if (!redisClient) throw new Error('Redis is not initialized.');
  const reply = await redisClient.hGet(key, `page-${page}`);

  return reply ? JSON.parse(reply) : null;
}

/**
 * Deletes a search result cache by it's key.
 * @param {String} key Key of cache
 * @returns {Promise<Boolean>} Returns a promise to resolve with a boolean
 *  indicating if the cache was deleted.
 */
export async function deleteCacheSearch(key: string): Promise<boolean> {
  if (!redisClient) throw new Error('Redis is not initialized.');

  const reply = await redisClient.del(key);
  return reply > 0;
}
