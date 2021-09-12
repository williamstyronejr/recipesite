import redis, { RedisClient } from 'redis';
import logger from './logger';

let redisClient: RedisClient | null;

/**
 * Creates a connection to redis server. Will prioritize URL over host and port.
 * @param {String} HOST Hostname for redis
 * @param {Number} PORT Port for redis
 * @param {String|Null} URL URL for redis conection.
 * @return {Promise<Object>} Returns a promise to resolve with a redis client
 *  when it's ready.
 */
export function setUpRedis(
  HOST = 'localhost',
  PORT = 6379,
  URL: string | null = null,
): Promise<RedisClient> {
  redisClient = URL ? redis.createClient(URL) : redis.createClient(PORT, HOST);

  return new Promise((res, rej) => {
    redisClient?.on('error', (err) => {
      rej(err);
    });

    redisClient?.on('ready', () => {
      logger.info(`Redis connection made on ${HOST}:${PORT}`);
      return res(redisClient as RedisClient);
    });
  });
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
export function cacheSearch(
  key: string,
  value: Record<string, unknown>,
  page: number,
): Promise<boolean> {
  return new Promise((res, rej) => {
    redisClient?.hset(
      key,
      `page-${page}`,
      JSON.stringify(value),
      (err, reply) => {
        if (err) return rej(err);
        if (reply === 0) return false;

        // If key has no TTL, set one
        redisClient?.ttl(key, (ttlErr, ttlReply) => {
          if (ttlReply < 0) redisClient?.expire(key, 60 * 60 * 24);
          res(true);
        });
      },
    );
  });
}

/**
 * Finds and returns cache of search results.
 * @param {Stirng} key Key of cache to get
 * @param {Number} page Page number of result
 * @returns {Promise<Object>} Returns a promise to resolve with json object
 *  of the cached results.
 */
export function getCacheSearch(
  key: string,
  page: number,
): Promise<Record<string, unknown>> {
  return new Promise((res, rej) => {
    redisClient?.hget(key, `page-${page}`, (err, reply) => {
      if (err) rej(err);

      res(JSON.parse(reply));
    });
  });
}

/**
 * Deletes a search result cache by it's key.
 * @param {String} key Key of cache
 * @returns {Promise<Boolean>} Returns a promise to resolve with a boolean
 *  indicating if the cache was deleted.
 */
export function deleteCacheSearch(key: string): Promise<boolean> {
  return new Promise((res, rej) => {
    redisClient?.del(key, (err, reply) => {
      if (err) return rej(err);
      res(reply > 0 ? true : false);
    });
  });
}
