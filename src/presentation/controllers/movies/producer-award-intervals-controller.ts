import { Request, Response } from 'express';
import { Controller } from '../../interfaces/controller';
import { Presenter } from '../../interfaces/presenter';
import { HttpResponse } from '../../interfaces/http';
import { GetProducerAwardIntervals } from '../../../application/use-cases/movies/get-producer-award-intervals';

export class ProducerAwardIntervalsController implements Controller {
  constructor(
    private readonly getProducerAwardIntervals: GetProducerAwardIntervals,
    private readonly presenter: Presenter
  ) {}

  public async handle(req: Request, res: Response): Promise<HttpResponse> {
    try {
      const result = await this.getProducerAwardIntervals.execute();
      return this.presenter.success(result);
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }
} 