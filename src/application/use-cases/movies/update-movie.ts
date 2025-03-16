import { MovieRepository } from '../../../data/interfaces/movie-repository';
import { Movie } from '../../../domain/entities/movie';
import { NotFoundError } from '../../../presentation/interfaces/error';

export interface UpdateMovieData {
  id: string;
  title?: string;
  year?: number;
  studios?: string;
  producers?: string;
  winner?: boolean;
}

export class UpdateMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(data: UpdateMovieData): Promise<Movie> {
    const movie = await this.movieRepository.findById(data.id);

    if (!movie) throw new NotFoundError('Movie not found');
    
    const { id, ...rest } = data;

    return this.movieRepository.update(id, rest);
  }
} 