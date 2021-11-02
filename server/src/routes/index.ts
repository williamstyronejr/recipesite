import path from 'path';
import { Application, Response, Request, NextFunction, Router } from 'express';
import logger from '../services/logger';

export const setUpRoutes = (app: Application): void => {
  app.post('/signout', (req: Request, res: Response) => {
    // Destroy cookie
    res.clearCookie('token');
    res.json({ success: true });
  });

  // Default to build of react app
  app.use('/*', (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendFile(
        path.join(__dirname, '..', '..', '..', 'client', 'build', 'index.html'),
      );
    } catch (err) {
      next(err);
    }
  });

  // Catch all error handler
  app.use((err: Error, req: Request, res: Response) => {
    if (err) {
      logger.error(err);
    }

    res.status(500).send('Server error has occurred.');
  });
};
