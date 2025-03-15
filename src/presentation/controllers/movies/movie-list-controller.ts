import { Controller } from "../../interfaces/controller";
import { DbMovieList } from "../../../application/use-cases/movies/movie-list";
import { HttpResponse } from "../../interfaces/http";
import { Presenter } from '../../interfaces/presenter';

export class MovieListController implements Controller {
  constructor(
    private readonly movieList: DbMovieList,
    private readonly presenter: Presenter
  ) {}

  async handle(): Promise<HttpResponse> {
    try {
      const movies = await this.movieList.execute();
      return this.presenter.success(movies);
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }
}