import { CreateMovieController } from '../../../presentation/controllers/movies/create-movie-controller';
import { SqliteMovieRepository } from '../../../infra/db/sqlite-movie-repository';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';
import { CreateMovieUseCase } from '../../../application/use-cases/movies/create-movie';

export const makeCreateMovieController = (): CreateMovieController => {
  const movieRepository = new SqliteMovieRepository();
  const createMovie = new CreateMovieUseCase(movieRepository);
  const presenter = new HttpPresenter();
  return new CreateMovieController(createMovie, presenter);
}; 