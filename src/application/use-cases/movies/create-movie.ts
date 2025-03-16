import { MovieRepository } from '../../../data/interfaces/movie-repository';
import { MOVIE_MIN_YEAR } from '../../../domain/constants/movies';
import { CreateMovieData, Movie } from '../../../domain/entities/movie';
import { ValidationError, ConflictError, UnprocessableEntityError } from '../../../presentation/interfaces/error';

export class CreateMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(data: CreateMovieData): Promise<Movie> {
    if (!data.title?.trim()) {
      throw new ValidationError('O título do filme é obrigatório');
    }

    if (!data.year) {
      throw new ValidationError('O ano do filme é obrigatório');
    }

    if (data.year < MOVIE_MIN_YEAR) {
      throw new UnprocessableEntityError('O ano do filme deve ser maior que 1900');
    }

    const currentYear = new Date().getFullYear();
    if (data.year > currentYear) {
      throw new UnprocessableEntityError('O ano do filme não pode ser no futuro');
    }

    const existingMovie = await this.movieRepository.findByTitle(data.title.trim());
    if (existingMovie) {
      throw new ConflictError('Já existe um filme cadastrado com este título');
    }

    return this.movieRepository.create({
      ...data,
      title: data.title.trim()
    });
  }
} 