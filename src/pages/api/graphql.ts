import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import processRequest from 'graphql-upload/processRequest.mjs';
import { parseBody } from 'next/dist/server/api-utils/node';
import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextApiRequest, res: NextApiResponse) => ({
    req,
    res,
    token: req.headers.token,
  }),
});

const graphql: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const contentType = req.headers['content-type'];
  if (contentType && contentType.indexOf('multipart/form-data') > -1) {
    req.body = await processRequest(req, res);
  } else {
    req.body = await parseBody(req, 100000);
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await handler(req, res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default graphql;
