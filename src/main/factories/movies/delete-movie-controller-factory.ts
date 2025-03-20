import { DeleteMovieUseCase } from '../../../application/use-cases/movies/delete-movie';
import { SqliteMovieRepository } from '../../../infra/db/sqlite-movie-repository';
import { DeleteMovieController } from '../../../presentation/controllers/movies/delete-movie-controller';
import { Controller } from '../../../presentation/interfaces/controller';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeDeleteMovieController = (): Controller => {
  const movieRepository = new SqliteMovieRepository();
  const deleteMovie = new DeleteMovieUseCase(movieRepository);
  const presenter = new HttpPresenter();
  return new DeleteMovieController(deleteMovie, presenter);
}; 