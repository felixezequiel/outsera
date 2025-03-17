import { MovieRepository } from "../../../data/interfaces/movie-repository";
import { Movie } from "../../../domain/entities/movie";
import { NotFoundError } from "../../../presentation/interfaces/error";
import { ParamUpdateMovie, UpdateMovie } from "../../interfaces/movies";

export class UpdateMovieUseCase implements UpdateMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(data: ParamUpdateMovie): Promise<Movie> {
    if (!data.id) throw new NotFoundError("Movie not found");

    const movie = await this.movieRepository.findById(data.id);

    if (!movie) throw new NotFoundError("Movie not found");

    return this.movieRepository.update(data.id, data.data);
  }
}
