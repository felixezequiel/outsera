import { Movie, CreateMovieData, UpdateMovieData } from '../../domain/entities/movie';
import { MovieRepository } from '../../data/interfaces/movie-repository';
import { prisma } from './database';

export class PrismaMovieRepository implements MovieRepository {
  async create(data: CreateMovieData): Promise<Movie> {
    return prisma.movie.create({
      data
    });
  }

  async findById(id: string): Promise<Movie | null> {
    return prisma.movie.findUnique({
      where: { id }
    });
  }

  async findByTitle(title: string): Promise<Movie | null> {
    return prisma.movie.findFirst({
      where: { title }
    });
  }

  async findByYear(year: number): Promise<Movie[]> {
    return prisma.movie.findMany({
      where: { year }
    });
  }

  async findWinners(): Promise<Movie[]> {
    return prisma.movie.findMany({
      where: { winner: true }
    });
  }

  async findAll(): Promise<Movie[]> {
    return prisma.movie.findMany();
  }

  async update(id: string, data: UpdateMovieData): Promise<Movie> {
    return prisma.movie.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.movie.delete({
      where: { id }
    });
  }

  async bulkCreate(data: CreateMovieData[]): Promise<void> {
    await prisma.movie.createMany({
      data
    });
  }
} 