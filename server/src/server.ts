import { createServer } from 'http';
import app from './services/app';
import logger from './services/logger';

export const startServer = async (IP: string, PORT: number): Promise<void> => {
  const httpServer = createServer(app);

  httpServer.listen(PORT, IP, () => {
    logger.info(`Server started at ${IP}:${PORT}`);
  });
};
