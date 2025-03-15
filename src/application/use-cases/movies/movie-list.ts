import { MovieRepository } from '../../../data/interfaces/movie-repository';
import { Movie } from '../../../domain/entities/movie';

export class DbMovieList {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(): Promise<Movie[]> {
    return this.movieRepository.findAll();
  }
} 