import { MovieRepository } from "../../../data/interfaces/movie-repository";
import { MOVIE_MIN_YEAR } from "../../../domain/constants/movies";
import { CreateMovieData, Movie } from "../../../domain/entities/movie";
import { ValidationError } from "../../../presentation/interfaces/error";
import { ImportMovies } from "../../interfaces/movies";

export class ImportMoviesUseCase implements ImportMovies {
  private readonly BATCH_SIZE = 100; // Tamanho do lote para processamento

  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(movies: CreateMovieData[]): Promise<Movie[]> {
    if (!movies?.length) {
      throw new ValidationError("Nenhum filme para importar");
    }
  
    // Validação básica dos dados usando for await
    for (const [index, movie] of movies.entries()) {
      if (!movie.title || movie.title?.trim() === '') {
        throw new ValidationError(
          `Filme na linha ${index + 1} não possui título`
        );
      }
  
      const existingMovie = await this.movieRepository.findByTitle(movie.title);
      if (existingMovie) {
        throw new ValidationError(
          `Filme na linha ${index + 1} já existe na base de dados`
        );
      }
  
      if (!movie.year || isNaN(movie.year) || movie.year < MOVIE_MIN_YEAR) {
        throw new ValidationError(
          `Filme na linha ${index + 1} possui ano inválido`
        );
      }
  
      if (!movie.studios || movie.studios.trim() === '') {
        throw new ValidationError(
          `Filme na linha ${index + 1} não possui estúdio`
        );
      }
  
      if (!movie.producers || movie.producers.trim() === '') {
        throw new ValidationError(
          `Filme na linha ${index + 1} não possui produtor`
        );
      }
    }
  
    const inserted: Movie[] = [];
  
    // Processa em lotes para evitar sobrecarga de memória
    for (let i = 0; i < movies.length; i += this.BATCH_SIZE) {
      const batch = movies.slice(i, i + this.BATCH_SIZE);
      const response = await this.movieRepository.bulkCreate(batch);
  
      inserted.push(...response);
    }
  
    return inserted;
  }
}
