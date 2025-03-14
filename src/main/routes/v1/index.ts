import { Router } from 'express';
import movieRoutes from './movie-routes';

export default (router: Router): void => {
  movieRoutes(router);
}; 