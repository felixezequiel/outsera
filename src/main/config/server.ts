import { Application } from 'express';
import { cleanDatabase, connectDatabase } from '../../infra/db/database';
import { ImportMovies } from '../../application/use-cases/movies/import-movies';
import { CreateMovieData } from '../../domain/entities/movie';
import { readFileSync, createWriteStream } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';
import { config } from 'dotenv';
import { PrismaMovieRepository } from '../../infra/db/prisma-movie-repository';
import { DbMovieList } from '../../application/use-cases/movies/movie-list';
import { Console } from 'console';
import fs from 'fs';

config();

const logger = new Console({
  stdout: createWriteStream('startup-data.txt'),
});

interface MovieRecord {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner?: string;
}

export class Server {
  private readonly movieRepository: PrismaMovieRepository;
  
  constructor(private readonly app: Application) {
    this.movieRepository = new PrismaMovieRepository();
  }

  private convertToMovieData(record: MovieRecord): CreateMovieData {
    return {
      year: parseInt(record.year),
      title: record.title,
      studios: record.studios,
      producers: record.producers,
      winner: record.winner === 'yes'
    };
  }

  private async importInitialData(): Promise<void> {
    try {
      const csvPath = join(__dirname, '../../../Movielist.csv');
      const csvContent = readFileSync(csvPath, 'utf-8');
      
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';'
      }) as MovieRecord[];

      const importMovies = new ImportMovies(this.movieRepository);
      const listMovies = new DbMovieList(this.movieRepository);
      
      const moviesData = records.map(record => this.convertToMovieData(record));
      await importMovies.execute(moviesData);

      const movies = await listMovies.execute();

      logger.log('Relatório de Importação de Dados');
      logger.log('============================\n');
      logger.log(`Data da importação: ${new Date().toLocaleString('pt-BR')}`);
      logger.log(`Total de filmes: ${movies.length}`);
      logger.log('Lista de Filmes:');
      logger.log('==============\n');
      logger.table(movies);

      console.log('Dados importados com sucesso!');
      console.log('Relatório completo disponível em: startup-data.txt');
    } catch (error) {
      console.error('Erro ao importar dados iniciais:', error);
    }
  }

  public async start(): Promise<void> {
    const port = process.env.PORT || 3000;

    try {
      await connectDatabase();
      await cleanDatabase();
      await this.importInitialData();
      
      this.app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      
      process.exit(1);
    }
  }
} 