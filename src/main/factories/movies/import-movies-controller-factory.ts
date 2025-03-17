import { ImportMoviesController } from '../../../presentation/controllers/movies/import-movies-controller';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';
import { ImportMoviesUseCase } from '../../../application/use-cases/movies/import-movies';

export const makeImportMoviesController = (): ImportMoviesController => {
  const movieRepository = new PrismaMovieRepository();
  const importMovies = new ImportMoviesUseCase(movieRepository);
  const presenter = new HttpPresenter();
  return new ImportMoviesController(importMovies, presenter);
}; 