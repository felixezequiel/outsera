import { ImportMoviesController } from '../../../presentation/controllers/movies/import-movies-controller';
import { SqliteMovieRepository } from '../../../infra/db/sqlite-movie-repository';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';
import { ImportMoviesUseCase } from '../../../application/use-cases/movies/import-movies';

export const makeImportMoviesController = (): ImportMoviesController => {
  const movieRepository = new SqliteMovieRepository();
  const importMovies = new ImportMoviesUseCase(movieRepository);
  const presenter = new HttpPresenter();
  return new ImportMoviesController(importMovies, presenter);
}; 