import { ProducerAwardIntervalsController } from '../../../presentation/controllers/movies/producer-award-intervals-controller';
import { PrismaMovieRepository } from '../../../infra/db/prisma-movie-repository';
import { GetProducerAwardIntervals } from '../../../application/use-cases/movies/get-producer-award-intervals';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeProducerAwardIntervalsController = (): ProducerAwardIntervalsController => {
  const movieRepository = new PrismaMovieRepository();
  const getProducerAwardIntervals = new GetProducerAwardIntervals(movieRepository);
  const presenter = new HttpPresenter();
  return new ProducerAwardIntervalsController(getProducerAwardIntervals, presenter);
}; 