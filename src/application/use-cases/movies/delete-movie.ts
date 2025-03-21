import { MovieRepository } from "../../../data/interfaces/movie-repository";
import { NotFoundError } from "../../../presentation/interfaces/error";
import { DeleteMovie } from "../../interfaces/movies";

export class DeleteMovieUseCase implements DeleteMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(id: string): Promise<void> {
    const movie = await this.movieRepository.findById(id);

    if (!movie) throw new NotFoundError("Movie not found");

    await this.movieRepository.delete(id);
  }
}
