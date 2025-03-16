import { Movie, CreateMovieData, UpdateMovieData } from '../../domain/entities/movie';
import { MovieRepository } from '../../data/interfaces/movie-repository';
import { prisma } from './database';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

export class PrismaMovieRepository implements MovieRepository {
  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  async create(data: CreateMovieData): Promise<Movie> {
    const movie: Movie = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await prisma.movie.create({
      data: movie
    });

    return movie;
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    return movie;
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

  async deleteAll(): Promise<void> {
    await this.prisma.movie.deleteMany({
      where: {} // força a deleção de todos os registros
    });
  }
} 