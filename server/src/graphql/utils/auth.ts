import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import logger from '../../services/logger';

const { JWT_SECRET } = process.env;

export default function checkAuth(context: any, required = true): any {
  const { token } = context.req.cookies;

  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET as string);
      return user;
    } catch (err) {
      logger.info('User cookie was invalid');
      context.res.clearCookie('token');
      if (required) throw new AuthenticationError('Invalid/Expired token');
    }
  }

  if (required) throw new AuthenticationError('No token was found.');
}
