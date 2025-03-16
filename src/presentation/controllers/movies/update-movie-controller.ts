import { UpdateMovie } from '../../../application/use-cases/movies/update-movie';
import { MovieRepository } from '../../../data/interfaces/movie-repository';
import { MOVIE_MIN_YEAR } from '../../../domain/constants/movies';
import { UpdateMovieData } from '../../../domain/entities/movie';
import { Controller } from '../../interfaces/controller';
import { HttpRequest, HttpResponse } from '../../interfaces/http';
import { Presenter } from '../../interfaces/presenter';

export class UpdateMovieController implements Controller {
  constructor(
    private readonly updateMovie: UpdateMovie,
    private readonly movieRepository: MovieRepository,
    private readonly presenter: Presenter
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const { title, year, studios, producers, winner } = request.body as UpdateMovieData;

      if (title) {
        const existingMovie = await this.movieRepository.findByTitle(title);
        if (existingMovie) return this.presenter.conflict('Filme com o mesmo título já existe');
      }

      if (title?.trim() === '') {
        return this.presenter.unprocessableEntity('O título não pode estar vazio');
      }

      if (year !== undefined && (year < MOVIE_MIN_YEAR || year > new Date().getFullYear())) {
        return this.presenter.unprocessableEntity('Ano deve ser maior que 1800 e não pode ser no futuro');
      }

      const movie = await this.updateMovie.execute({
        id,
        title,
        year,
        studios,
        producers,
        winner
      });

      return this.presenter.success({
        message: 'Filme atualizado com sucesso',
        data: movie
      });
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }
} 