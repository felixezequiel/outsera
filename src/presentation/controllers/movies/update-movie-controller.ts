import { UpdateMovie } from '../../../application/use-cases/movies/update-movie';
import { Controller } from '../../interfaces/controller';
import { HttpRequest, HttpResponse } from '../../interfaces/http';
import { Presenter } from '../../interfaces/presenter';

export class UpdateMovieController implements Controller {
  constructor(
    private readonly updateMovie: UpdateMovie,
    private readonly presenter: Presenter
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;
      const { title, year, studios, producers, winner } = request.body;

      const movie = await this.updateMovie.execute({
        id,
        title,
        year: year ? parseInt(year) : undefined,
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