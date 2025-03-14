import { Movie } from '../../entities/movie';
import { MovieRepository } from '../../../data/interfaces/movie-repository';

export class DbMovieList {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(): Promise<Movie[]> {
    return this.movieRepository.findAll();
  }
} 