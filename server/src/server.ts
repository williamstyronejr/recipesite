import http from 'http';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { graphqlUploadExpress } from 'graphql-upload';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import logger from './services/logger';
import db from './models';

// import { setUpRedis } from './services/redis';

// const { REDIS_HOST, REDIS_PORT, REDIS_URL } = process.env;

export const startServer = async (IP: string, PORT: number): Promise<void> => {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use('/img', express.static(path.join(__dirname, 'public', 'images')));
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });

  await db.sequelize.sync({ force: false });

  await new Promise<void>((r) =>
    httpServer.listen({ port: PORT, host: IP }, r),
  );

  logger.info(`Server started at ${IP}:${PORT}${server.graphqlPath}`);
};
