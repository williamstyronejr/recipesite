import http from 'http';
import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { json } from 'body-parser';
import app from './services/app';

import { setUpRoutes } from './routes';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import logger from './services/logger';
import db from './models';

interface I_Context extends BaseContext {
  token?: string;
  req?: Express.Request;
  res?: Express.Response;
}

export const startServer = async (IP: string, PORT: number): Promise<void> => {
  const httpServer = http.createServer(app);
  const server = new ApolloServer<I_Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    '/graphql',
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res, token: req.headers.token }),
    }),
  );

  setUpRoutes(app);

  await db.sequelize.sync({ force: false });
  await new Promise<void>((r) =>
    httpServer.listen({ port: PORT, host: IP }, r),
  );

  logger.info(`Server started at ${IP}:${PORT}`);
};
