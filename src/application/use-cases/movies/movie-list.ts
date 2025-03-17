import { MovieRepository } from "../../../data/interfaces/movie-repository";
import { Movie } from "../../../domain/entities/movie";
import { ListMovies } from "../../interfaces/movies";

export class MovieListUseCase implements ListMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(): Promise<Movie[]> {
    return this.movieRepository.findAll();
  }
}
