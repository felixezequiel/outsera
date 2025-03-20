import { Movie, CreateMovieData, UpdateMovieData } from '../../domain/entities/movie';
import { MovieRepository } from '../../data/interfaces/movie-repository';
import { getConnection } from './database';
import { randomUUID } from 'crypto';

export class SqliteMovieRepository implements MovieRepository {
  async create(data: CreateMovieData): Promise<Movie> {
    const db = await getConnection();
    const movie: Movie = { 
      id: randomUUID(), 
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.run(
      `INSERT INTO movies (id, title, year, studios, producers, winner, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.id,
        movie.title,
        movie.year,
        movie.studios,
        movie.producers,
        movie.winner ? 1 : 0,
        movie.createdAt.toISOString(),
        movie.updatedAt.toISOString()
      ]
    );

    return movie;
  }

  async findById(id: string): Promise<Movie | null> {
    const db = await getConnection();
    const row = await db.get(
      `SELECT * FROM movies WHERE id = ?`,
      [id]
    );

    if (!row) return null;

    return this.mapRowToMovie(row);
  }

  async findByTitle(title: string): Promise<Movie | null> {
    const db = await getConnection();
    const row = await db.get(
      `SELECT * FROM movies WHERE title = ?`,
      [title]
    );

    if (!row) return null;

    return this.mapRowToMovie(row);
  }

  async findByYear(year: number): Promise<Movie[]> {
    const db = await getConnection();
    const rows = await db.all(
      `SELECT * FROM movies WHERE year = ?`,
      [year]
    );

    return rows.map(row => this.mapRowToMovie(row));
  }

  async findWinners(): Promise<Movie[]> {
    const db = await getConnection();
    const rows = await db.all(
      `SELECT * FROM movies WHERE winner = 1`
    );

    return rows.map(row => this.mapRowToMovie(row));
  }

  async findAll(): Promise<Movie[]> {
    const db = await getConnection();
    const rows = await db.all(`SELECT * FROM movies`);

    return rows.map(row => this.mapRowToMovie(row));
  }

  async update(id: string, data: UpdateMovieData): Promise<Movie> {
    const db = await getConnection();
    const movie = await this.findById(id);

    if (!movie) {
      throw new Error(`Movie with id ${id} not found`);
    }

    const updatedMovie = {
      ...movie,
      ...data,
      updatedAt: new Date()
    };

    const params = [
      updatedMovie.title,
      updatedMovie.year,
      updatedMovie.studios,
      updatedMovie.producers,
      updatedMovie.winner ? 1 : 0,
      updatedMovie.updatedAt.toISOString(),
      id
    ];

    await db.run(
      `UPDATE movies 
       SET title = ?, year = ?, studios = ?, producers = ?, winner = ?, updatedAt = ?
       WHERE id = ?`,
      params
    );

    return updatedMovie;
  }

  async delete(id: string): Promise<void> {
    const db = await getConnection();
    await db.run(
      `DELETE FROM movies WHERE id = ?`,
      [id]
    );
  }

  async bulkCreate(data: CreateMovieData[]): Promise<Movie[]> {
    const db = await getConnection();
    const movies: Movie[] = [];

    // Inicia uma transação
    await db.exec('BEGIN TRANSACTION');

    try {
      for (const item of data) {
        const movie: Movie = {
          id: randomUUID(),
          ...item,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.run(
          `INSERT INTO movies (id, title, year, studios, producers, winner, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            movie.id,
            movie.title,
            movie.year,
            movie.studios,
            movie.producers,
            movie.winner ? 1 : 0,
            movie.createdAt.toISOString(),
            movie.updatedAt.toISOString()
          ]
        );

        movies.push(movie);
      }

      // Confirma a transação
      await db.exec('COMMIT');
      return movies;
    } catch (error) {
      // Rollback em caso de erro
      await db.exec('ROLLBACK');
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    const db = await getConnection();
    await db.run('DELETE FROM movies');
  }

  // Função auxiliar para converter uma linha do banco em um objeto Movie
  private mapRowToMovie(row: any): Movie {
    return {
      id: row.id,
      title: row.title,
      year: row.year,
      studios: row.studios,
      producers: row.producers,
      winner: row.winner === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }
} 