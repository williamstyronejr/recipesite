import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { removeTokenCookie } from '@/apollo/cookies';

const AuthenticationError = (msg: string) =>
  new GraphQLError(msg, {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  });

const { JWT_SECRET } = process.env;

export default function checkAuth(context: any, required = true): any {
  const { token } = context.req.cookies;

  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET as string);
      return user;
    } catch (err) {
      removeTokenCookie(context.res);
      if (required) throw AuthenticationError('Invalid/Expired token');
    }
  }

  if (required) throw AuthenticationError('No token was found.');
}
