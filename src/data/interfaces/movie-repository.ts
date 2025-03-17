import { Movie, CreateMovieData, UpdateMovieData } from '../../domain/entities/movie';

export interface MovieRepository {
  create(data: CreateMovieData): Promise<Movie>;
  findById(id: string): Promise<Movie | null>;
  findByTitle(title: string): Promise<Movie | null>;
  findByYear(year: number): Promise<Movie[]>;
  findWinners(): Promise<Movie[]>;
  update(id: string, data: UpdateMovieData): Promise<Movie>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Movie[]>;
  bulkCreate(data: CreateMovieData[]): Promise<Movie[]>;
} 