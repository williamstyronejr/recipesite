import path from 'path';
import { Application, Response, Request, NextFunction } from 'express';

export const setUpRoutes = (app: Application): void => {
  // Default to build of react app
  app.use('/*', (req: Request, res: Response, next: NextFunction) => {
    console.log('testing');
    try {
      res.sendFile(
        path.join(__dirname, '..', '..', '..', 'client', 'build', 'index.html'),
      );
    } catch (err) {
      next(err);
    }
  });
};
