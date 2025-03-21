import { UpdateMovie } from '../../../application/interfaces/movies';
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

      if (year !== undefined && (year < MOVIE_MIN_YEAR)) {
        return this.presenter.unprocessableEntity('Ano deve ser maior que 1800 e não pode ser no futuro');
      }

      const data: UpdateMovieData = {
        title,
        year,
        studios,
        producers,
        winner
      };

      const movie = await this.updateMovie.execute({ id, data });

      return this.presenter.success({
        message: 'Filme atualizado com sucesso',
        data: movie
      });
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }
} 