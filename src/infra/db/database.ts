import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Singleton para manter a conexão
let db: Database | null = null;

// Função para obter a conexão com o banco de dados
export async function getConnection(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });
    
    // Configurações para melhorar a performance
    await db.exec('PRAGMA journal_mode = MEMORY');
    await db.exec('PRAGMA temp_store = MEMORY');
    await db.exec('PRAGMA synchronous = OFF');
  }
  
  return db;
}

// Inicializa o banco de dados criando as tabelas necessárias
export async function connectDatabase(): Promise<void> {
  try {
    const db = await getConnection();
    
    // Cria a tabela de filmes
    await db.exec(`
      CREATE TABLE IF NOT EXISTS movies (
        id TEXT PRIMARY KEY,
        title TEXT UNIQUE NOT NULL,
        year INTEGER NOT NULL,
        studios TEXT NOT NULL,
        producers TEXT NOT NULL,
        winner BOOLEAN NOT NULL DEFAULT FALSE,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    
    console.log('Banco de dados conectado com sucesso (em memória)');
  } catch (error) {
    console.error('Falha na conexão com o banco de dados:', error);
    throw error;
  }
}

// Limpa o banco de dados
export async function cleanDatabase(): Promise<void> {
  try {
    const db = await getConnection();
    
    // Verifica se a tabela existe
    const tableExists = await db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='movies'`
    );
    
    if (tableExists) {
      await db.exec('DELETE FROM movies');
      console.log('Banco de dados limpo com sucesso');
    } else {
      console.log('Tabela movies não existe, pulando limpeza');
    }
  } catch (error) {
    console.error('Falha ao limpar o banco de dados:', error);
    throw error;
  }
}

// Fecha a conexão
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('Conexão com o banco de dados fechada');
  }
}