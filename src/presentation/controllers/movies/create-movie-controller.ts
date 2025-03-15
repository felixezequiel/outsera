import { Request, Response } from "express";
import { Controller } from "../../interfaces/controller";
import { Presenter } from "../../interfaces/presenter";
import { HttpResponse } from "../../interfaces/http";
import { CreateMovie } from "../../../application/use-cases/movies/create-movie";

export class CreateMovieController implements Controller {
  constructor(
    private readonly createMovie: CreateMovie,
    private readonly presenter: Presenter
  ) {}

  public async handle(req: Request, res: Response): Promise<HttpResponse> {
    try {
      const movie = await this.createMovie.execute({
        title: req.body.title,
        year: Number(req.body.year),
        studios: req.body.studios,
        producers: req.body.producers,
        winner: req.body.winner === 'yes' || req.body.winner === true
      });
      
      return this.presenter.created(movie);
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }
} 