import { MovieListController } from '../../../presentation/controllers/movies/movie-list-controller';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { DbMovieList } from '../../../domain/usecases/movies/movie-list';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeMovieListController = (): MovieListController => {
  const movieRepository = new PrismaMovieRepository();
  const movieList = new DbMovieList(movieRepository);
  const presenter = new HttpPresenter();
  return new MovieListController(movieList, presenter);
}; 