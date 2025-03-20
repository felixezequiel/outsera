import { ProducerAwardIntervalsController } from '../../../presentation/controllers/movies/producer-award-intervals-controller';
import { SqliteMovieRepository } from '../../../infra/db/sqlite-movie-repository';
import { GetProducerAwardIntervalsUseCase } from '../../../application/use-cases/movies/get-producer-award-intervals';
import { HttpPresenter } from '../../../presentation/presenters/http-presenter';

export const makeProducerAwardIntervalsController = (): ProducerAwardIntervalsController => {
  const movieRepository = new SqliteMovieRepository();
  const getProducerAwardIntervals = new GetProducerAwardIntervalsUseCase(movieRepository);
  const presenter = new HttpPresenter();
  return new ProducerAwardIntervalsController(getProducerAwardIntervals, presenter);
}; 