import { CreateMovieController } from '../../../presentation/controllers/movies/create-movie-controller';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { CreateMovie } from '../../../domain/usecases/movies/create-movie';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeCreateMovieController = (): CreateMovieController => {
  const movieRepository = new PrismaMovieRepository();
  const createMovie = new CreateMovie(movieRepository);
  const presenter = new HttpPresenter();
  return new CreateMovieController(createMovie, presenter);
}; 