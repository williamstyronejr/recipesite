import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export default function checkAuth(context: any): any {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET as string);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error('Authorization header must be provided');
}
