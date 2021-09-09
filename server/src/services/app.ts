import path from 'path';
import express, { Request, Response } from 'express';
import logger from './logger';
import { setUpRoutes } from '../routes';
const app = express();

// Static folder
app.use(
  '/static',
  express.static(
    path.join(__dirname, '..', '..', '..', '..', 'client', 'build', 'static'),
  ),
);

setUpRoutes(app);

app.use((err: Error, req: Request, res: Response) => {
  if (err) {
    logger.error(err);
  }

  res.status(500).send('Server error has occurred.');
});

export default app;
