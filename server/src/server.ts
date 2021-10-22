import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import app from './services/app';
import { setUpRoutes } from './routes';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import logger from './services/logger';
import db from './models';

export const startServer = async (IP: string, PORT: number): Promise<void> => {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      req,
      res,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
  });

  setUpRoutes(app);

  await db.sequelize.sync({ force: false });

  await new Promise<void>((r) =>
    httpServer.listen({ port: PORT, host: IP }, r),
  );

  logger.info(`Server started at ${IP}:${PORT}${server.graphqlPath}`);
};
