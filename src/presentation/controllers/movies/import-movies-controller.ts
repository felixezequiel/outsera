import { Request, Response } from 'express';
import { Controller } from '../../interfaces/controller';
import { Presenter } from '../../interfaces/presenter';
import { HttpResponse } from '../../interfaces/http';
import { CreateMovieData } from '../../../domain/entities/movie';
import { ValidationError } from '../../interfaces/error';
import { CsvMovieTransformer } from './csv-movie-transformer';
import { ImportMovies } from '../../../application/interfaces/movies';

export class ImportMoviesController implements Controller {
  private static readonly BATCH_SIZE = 100;
  private static readonly ALLOWED_MIME_TYPE = 'text/csv';

  constructor(
    private readonly importMovies: ImportMovies,
    private readonly presenter: Presenter
  ) {}

  public async handle(req: Request, res: Response): Promise<HttpResponse> {
    try {
      this.validateRequest(req);
      
      const movies = await this.processMoviesFile(req.file!);
      
      return this.presenter.success({
        message: `${movies.length} filmes importados com sucesso`
      });
    } catch (error: any) {
      return this.presenter.error(error);
    }
  }

  private validateRequest(req: Request): void {
    if (!req.file) {
      throw new ValidationError('Nenhum arquivo foi enviado');
    }

    if (req.file.mimetype !== ImportMoviesController.ALLOWED_MIME_TYPE) {
      throw new ValidationError('O arquivo deve estar no formato CSV');
    }
  }

  private async processMoviesFile(file: Express.Multer.File): Promise<CreateMovieData[]> {
    const movies: CreateMovieData[] = [];
    let currentBatch: CreateMovieData[] = [];

    return new Promise((resolve, reject) => {
      const fileStream = this.createFileStream(file);
      const parser = CsvMovieTransformer.createParser();
      const transformer = CsvMovieTransformer.createTransformer();

      fileStream
        .pipe(parser)
        .pipe(transformer)
        .on('data', async (movie: CreateMovieData) => {
          currentBatch.push(movie);
          movies.push(movie);
          
          if (currentBatch.length === ImportMoviesController.BATCH_SIZE) {
            const payload = [...currentBatch];
            currentBatch = [];

            try {
              await this.importMovies.execute(payload);
            } catch (error) {
              reject(error);
            }
          }
        })
        .on('end', async () => {
          try {
            if (currentBatch.length > 0) {
              await this.importMovies.execute(currentBatch);
            }
            resolve(movies);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error: Error) => reject(error));
    });
  }

  private createFileStream(file: Express.Multer.File) {
    const fileBuffer = Buffer.from(file.buffer);
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    return bufferStream;
  }
} 