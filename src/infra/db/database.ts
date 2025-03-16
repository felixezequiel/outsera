import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    // Força a criação das tabelas em memória
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS movies (
      id TEXT PRIMARY KEY,
      title TEXT UNIQUE NOT NULL,
      year INTEGER NOT NULL,
      studios TEXT NOT NULL,
      producers TEXT NOT NULL,
      winner BOOLEAN NOT NULL DEFAULT FALSE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL
    )`;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function cleanDatabase(): Promise<void> {
  try {
    // Verificar se a tabela existe
    const tableExists = await prisma.$queryRaw`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name='movies'
    `;

    if (Array.isArray(tableExists) && tableExists.length > 0) {
      await prisma.movie.deleteMany();
      console.log('Database cleaned successfully');
    } else {
      console.log('Table movies does not exist, skipping cleanup');
    }
  } catch (error) {
    console.error('Failed to clean database:', error);
    throw error;
  }
}