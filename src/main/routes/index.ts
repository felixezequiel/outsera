import { Express, Router } from 'express';
import movieRoutes from './movie-routes';

export const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  movieRoutes(router);
}; 