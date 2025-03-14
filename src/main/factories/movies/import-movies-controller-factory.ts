import { ImportMoviesController } from '../../../presentation/controllers/movies/import-movies-controller';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { ImportMovies } from '../../../domain/usecases/movies/import-movies';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeImportMoviesController = (): ImportMoviesController => {
  const movieRepository = new PrismaMovieRepository();
  const importMovies = new ImportMovies(movieRepository);
  const presenter = new HttpPresenter();
  return new ImportMoviesController(importMovies, presenter);
}; 