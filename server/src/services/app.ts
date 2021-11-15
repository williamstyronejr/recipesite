import path from 'path';
import cors from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
const app = express();

const { SESSION_TIMEOUT } = process.env;
app.use(
  cors({
    credentials: true,
    maxAge: parseInt(SESSION_TIMEOUT as string) || 1800,
    origin:
      process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  }),
);
app.use('/img', express.static(path.join(__dirname, '..', 'public', 'images')));

// Static folder
app.use(
  '/static',
  express.static(
    path.join(__dirname, '..', '..', '..', 'client', 'build', 'static'),
  ),
);

app.use(graphqlUploadExpress());
app.use(cookieParser());
app.use(
  csrf({
    cookie: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'development' ? false : true,
      httpOnly: true,
    },

    value: (req) => {
      const csrfToken = req.headers['csrf-token']
        ? (req.headers['csrf-token'] as string)
        : '';

      return csrfToken;
    },
  }),
);

// Error handler for CSRF token
app.use(function (err: any, req: any, res: any, next: any) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  return res.status(403).json({ ctoken: true });
});
export default app;
