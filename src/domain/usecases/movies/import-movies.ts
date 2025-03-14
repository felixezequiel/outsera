import { MovieRepository } from '../../../data/interfaces/movie-repository';
import { CreateMovieData } from '../../entities/movie';
import { ValidationError } from '../../../presentation/interfaces/error';

export class ImportMovies {
  private readonly BATCH_SIZE = 100; // Tamanho do lote para processamento

  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(movies: CreateMovieData[]): Promise<void> {
    if (!movies?.length) {
      throw new ValidationError('Nenhum filme para importar');
    }

    // Validação básica dos dados
    movies.forEach((movie, index) => {
      if (!movie.title?.trim()) {
        throw new ValidationError(`Filme na linha ${index + 1} não possui título`);
      }
      if (!movie.year || isNaN(movie.year)) {
        throw new ValidationError(`Filme na linha ${index + 1} possui ano inválido`);
      }
      if (!movie.studios?.trim()) {
        throw new ValidationError(`Filme na linha ${index + 1} não possui estúdio`);
      }
      if (!movie.producers?.trim()) {
        throw new ValidationError(`Filme na linha ${index + 1} não possui produtor`);
      }
    });

    // Processa em lotes para evitar sobrecarga de memória
    for (let i = 0; i < movies.length; i += this.BATCH_SIZE) {
      const batch = movies.slice(i, i + this.BATCH_SIZE);
      await this.movieRepository.bulkCreate(batch);
    }
  }
} 