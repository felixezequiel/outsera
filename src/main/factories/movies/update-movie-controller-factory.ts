import { UpdateMovieUseCase } from '../../../application/use-cases/movies/update-movie';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { UpdateMovieController } from '../../../presentation/controllers/movies/update-movie-controller';
import { Controller } from '../../../presentation/interfaces/controller';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeUpdateMovieController = (): Controller => {
  const movieRepository = new PrismaMovieRepository();
  const updateMovie = new UpdateMovieUseCase(movieRepository);
  const presenter = new HttpPresenter();

  return new UpdateMovieController(updateMovie, movieRepository, presenter);
};