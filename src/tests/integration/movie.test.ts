import fs from 'fs';
import csv from 'csv-parse';
import path from 'path';
import { CreateMovie } from '../../domain/usecases/movies/create-movie';
import { PrismaMovieRepository } from '../../infra/db/prisma-movie-repository';
import { UnprocessableEntityError } from '../../presentation/interfaces/error';

describe('Movie Integration Tests', () => {
  const movieRepository = new PrismaMovieRepository();
  const createMovie = new CreateMovie(movieRepository);

  it('deve criar um filme com sucesso', async () => {
    const movieData = {
      title: 'Test Movie',
      year: 2020,
      studios: 'Test Studios',
      producers: 'Test Producer',
      winner: false
    };

    const movie = await createMovie.execute(movieData);

    expect(movie).toBeDefined();
    expect(movie.id).toBeDefined();
    expect(movie.title).toBe(movieData.title);
    expect(movie.year).toBe(movieData.year);
    expect(movie.studios).toBe(movieData.studios);
    expect(movie.producers).toBe(movieData.producers);
    expect(movie.winner).toBe(movieData.winner);
  });

  it('não deve criar um filme com título duplicado', async () => {
    const movieData = {
      title: 'Duplicate Movie',
      year: 2020,
      studios: 'Test Studios',
      producers: 'Test Producer',
      winner: false
    };

    await createMovie.execute(movieData);

    await expect(createMovie.execute(movieData))
      .rejects
      .toThrow('Já existe um filme cadastrado com este título');
  });

  it('não deve criar um filme com ano inválido', async () => {
    const movieData = {
      title: 'Future Movie',
      year: new Date().getFullYear() + 1, // Sempre será um ano no futuro
      studios: 'Test Studios',
      producers: 'Test Producer',
      winner: false
    };

    try {
      await createMovie.execute(movieData);
      fail('Deveria ter lançado um erro');
    } catch (error: any) {
      expect(error).toBeInstanceOf(UnprocessableEntityError);
      expect(error.message).toBe('O ano do filme não pode ser no futuro');
    }
  });

  it('deve importar filmes do CSV com sucesso', async () => {
    const csvFilePath = path.resolve(__dirname, '../../../Movielist.csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

    const records: any[] = await new Promise((resolve, reject) => {
      csv.parse(fileContent, {
        columns: true,
        delimiter: ';',
        skip_empty_lines: true,
        trim: true,
      }, (err, records) => {
        if (err) reject(err);
        resolve(records);
      });
    });

    const movies = records.map(record => ({
      title: record.title,
      year: parseInt(record.year),
      studios: record.studios,
      producers: record.producers,
      winner: record.winner.toLowerCase() === 'yes'
    }));

    for (const movie of movies) {
      await createMovie.execute(movie);
    }

    const savedMovies = await movieRepository.findAll();
    expect(savedMovies).toHaveLength(movies.length);

    // Verifica se cada filme foi salvo corretamente
    for (const testMovie of movies) {
      const savedMovie = savedMovies.find(m => m.title === testMovie.title);
      expect(savedMovie).toBeDefined();
      expect(savedMovie?.year).toBe(testMovie.year);
      expect(savedMovie?.studios).toBe(testMovie.studios);
      expect(savedMovie?.producers).toBe(testMovie.producers);
      expect(savedMovie?.winner).toBe(testMovie.winner);
    }
  });

  it('deve buscar filmes por ano', async () => {
    const movieData1 = {
      title: 'Movie 1980 - 1',
      year: 1980,
      studios: 'Studio A',
      producers: 'Producer A',
      winner: true
    };

    const movieData2 = {
      title: 'Movie 1980 - 2',
      year: 1980,
      studios: 'Studio B',
      producers: 'Producer B',
      winner: false
    };

    await createMovie.execute(movieData1);
    await createMovie.execute(movieData2);

    const movies = await movieRepository.findByYear(1980);
    expect(movies).toHaveLength(2);
    expect(movies.map(m => m.title)).toContain(movieData1.title);
    expect(movies.map(m => m.title)).toContain(movieData2.title);
  });

  it('deve buscar filmes vencedores', async () => {
    const movieData1 = {
      title: 'Winner Movie',
      year: 1990,
      studios: 'Studio A',
      producers: 'Producer A',
      winner: true
    };

    const movieData2 = {
      title: 'Non Winner Movie',
      year: 1990,
      studios: 'Studio B',
      producers: 'Producer B',
      winner: false
    };

    await createMovie.execute(movieData1);
    await createMovie.execute(movieData2);

    const winners = await movieRepository.findWinners();
    expect(winners).toHaveLength(1);
    expect(winners[0].title).toBe(movieData1.title);
    expect(winners[0].winner).toBe(true);
  });
}); 