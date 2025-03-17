import { CreateMovieController } from '../../../presentation/controllers/movies/create-movie-controller';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';
import { CreateMovieUseCase } from '../../../application/use-cases/movies/create-movie';

export const makeCreateMovieController = (): CreateMovieController => {
  const movieRepository = new PrismaMovieRepository();
  const createMovie = new CreateMovieUseCase(movieRepository);
  const presenter = new HttpPresenter();
  return new CreateMovieController(createMovie, presenter);
}; 