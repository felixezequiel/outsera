import { DeleteMovie } from '../../../application/use-cases/movies/delete-movie';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { DeleteMovieController } from '../../../presentation/controllers/movies/delete-movie-controller';
import { Controller } from '../../../presentation/interfaces/controller';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeDeleteMovieController = (): Controller => {
  const movieRepository = new PrismaMovieRepository();
  const deleteMovie = new DeleteMovie(movieRepository);
  const presenter = new HttpPresenter();
  return new DeleteMovieController(deleteMovie, presenter);
}; 