import { ListMovies } from "../../../application/interfaces/movies";
import { Controller } from "../../interfaces/controller";
import { HttpResponse } from "../../interfaces/http";
import { Presenter } from '../../interfaces/presenter';

export class MovieListController implements Controller {
  constructor(
    private readonly movieList: ListMovies,
    private readonly presenter: Presenter
  ) {}

  async handle(): Promise<HttpResponse> {
    try {
      const movies = await this.movieList.execute();
      return this.presenter.success({length: movies.length, movies});
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }
}