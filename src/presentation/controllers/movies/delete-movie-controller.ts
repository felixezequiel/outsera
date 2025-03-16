import { DeleteMovie } from '../../../application/use-cases/movies/delete-movie';
import { Controller } from '../../interfaces/controller';
import { HttpRequest, HttpResponse } from '../../interfaces/http';
import { Presenter } from '../../interfaces/presenter';

export class DeleteMovieController implements Controller {
  constructor(
    private readonly deleteMovie: DeleteMovie,
    private readonly presenter: Presenter
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;

      await this.deleteMovie.execute(id);

      return this.presenter.success({
        message: 'Filme deletado com sucesso'
      });
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }
} 