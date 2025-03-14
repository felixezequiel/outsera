import { Router } from 'express';
import { makeMovieListController } from '../factories/movies/movie-list-controller-factory';
import { makeCreateMovieController } from '../factories/movies/create-movie-controller-factory';
import { makeImportMoviesController } from '../factories/movies/import-movies-controller-factory';
import { adaptRoute } from '../adapters/express-controller-adapter';
import upload from '../middlewares/upload';

export default (router: Router): void => {
  router.get('/movies', adaptRoute(makeMovieListController()));
  router.post('/movies', adaptRoute(makeCreateMovieController()));
  router.post('/movies/import', 
    upload.single('file'),
    adaptRoute(makeImportMoviesController())
  );
}; 