import path from 'path';
import cors from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import cookieParser from 'cookie-parser';
const app = express();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  }),
);

app.use(graphqlUploadExpress());
app.use(cookieParser());
app.use('/img', express.static(path.join(__dirname, '..', 'public', 'images')));

// Static folder
app.use(
  '/static',
  express.static(
    path.join(__dirname, '..', '..', '..', '..', 'client', 'build', 'static'),
  ),
);

export default app;
