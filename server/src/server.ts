import { createServer } from 'http';
import app from './services/app';
import logger from './services/logger';
import { setUpRedis } from './services/redis';

const { REDIS_HOST, REDIS_PORT, REDIS_URL } = process.env;

export const startServer = async (IP: string, PORT: number): Promise<void> => {
  const httpServer = createServer(app);
  try {
    await setUpRedis(
      REDIS_HOST,
      REDIS_PORT ? parseInt(REDIS_PORT) : undefined,
      REDIS_URL,
    );

    httpServer.listen(PORT, IP, () => {
      logger.info(`Server started at ${IP}:${PORT}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(0);
  }
};
