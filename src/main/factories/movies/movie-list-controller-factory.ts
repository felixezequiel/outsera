import { MovieListController } from '../../../presentation/controllers/movies/movie-list-controller';
import { SqliteMovieRepository } from '../../../infra/db/sqlite-movie-repository';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';
import { MovieListUseCase } from '../../../application/use-cases/movies/movie-list';

export const makeMovieListController = (): MovieListController => {
  const movieRepository = new SqliteMovieRepository();
  const movieList = new MovieListUseCase(movieRepository);
  const presenter = new HttpPresenter();
  return new MovieListController(movieList, presenter);
}; 