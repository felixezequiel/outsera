import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../../index';
import { prisma } from '../../infra/db/database';

describe('Movie Integration Tests', () => {
  beforeAll(async () => {
    // Garante que a conexão com o banco está estabelecida
    await prisma.$connect();
  });

  beforeEach(async () => {
    // Limpa todas as tabelas antes de cada teste
    await prisma.$transaction([
      prisma.movie.deleteMany()
    ]);
  });

  afterAll(async () => {
    // Limpa o banco e fecha a conexão
    await prisma.$transaction([
      prisma.movie.deleteMany()
    ]);
    await prisma.$disconnect();
  });

  describe('POST /api/v1/movies', () => {
    it('deve criar um filme com sucesso', async () => {
      const movieData = {
        title: 'Test Movie',
        year: 2020,
        studios: 'Test Studios',
        producers: 'Test Producer',
        winner: false
      };

      const response = await request(app)
        .post('/api/v1/movies')
        .send(movieData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(movieData.title);
      expect(response.body.year).toBe(movieData.year);
      expect(response.body.studios).toBe(movieData.studios);
      expect(response.body.producers).toBe(movieData.producers);
      expect(response.body.winner).toBe(movieData.winner);
    });

    it('não deve criar um filme com título duplicado', async () => {
      const movieData = {
        title: 'Duplicate Movie',
        year: 2020,
        studios: 'Test Studios',
        producers: 'Test Producer',
        winner: false
      };

      await request(app)
        .post('/api/v1/movies')
        .send(movieData)
        .expect(201);

      const response = await request(app)
        .post('/api/v1/movies')
        .send(movieData)
        .expect(409);

      expect(response.body.error).toBe('Já existe um filme cadastrado com este título');
    });

    it('não deve criar um filme com ano inválido', async () => {
      const movieData = {
        title: 'Future Movie',
        year: new Date().getFullYear() + 1,
        studios: 'Test Studios',
        producers: 'Test Producer',
        winner: false
      };

      const response = await request(app)
        .post('/api/v1/movies')
        .send(movieData)
        .expect(422);

      expect(response.body.error).toBe('O ano do filme não pode ser no futuro');
    });
  });

  describe('POST /api/v1/movies/import', () => {
    it('deve importar filmes do CSV com sucesso', async () => {
      const csvFilePath = path.resolve(__dirname, '../../../Movielist.csv');
      const fileBuffer = fs.readFileSync(csvFilePath);

      const response = await request(app)
        .post('/api/v1/movies/import')
        .attach('file', fileBuffer, 'Movielist.csv')
        .expect(200);

      expect(response.body.message).toMatch(/filmes importados com sucesso/);

      // Verifica se os filmes foram importados consultando a API
      const listResponse = await request(app)
        .get('/api/v1/movies')
        .expect(200);

      expect(listResponse.body.length).toBeGreaterThan(0);
    });

    it('deve rejeitar arquivo não-CSV', async () => {
      const response = await request(app)
        .post('/api/v1/movies/import')
        .attach('file', Buffer.from('invalid'), 'invalid.txt')
        .expect(400);

      expect(response.body.error).toBe('Apenas arquivos CSV são permitidos');
    });
  });

  describe('GET /api/v1/movies', () => {
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

      await request(app)
        .post('/api/v1/movies')
        .send(movieData1);

      await request(app)
        .post('/api/v1/movies')
        .send(movieData2);

      const response = await request(app)
        .get('/api/v1/movies')
        .query({ year: 1980 })
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.map((m: any) => m.title)).toContain(movieData1.title);
      expect(response.body.map((m: any) => m.title)).toContain(movieData2.title);
    });
  });

  describe('GET /api/v1/movies/producer-award-intervals', () => {
    it('deve retornar os intervalos de prêmios dos produtores corretamente após importar CSV', async () => {
      // Primeiro importa os dados do CSV
      const csvFilePath = path.resolve(__dirname, '../../../Movielist.csv');
      const fileBuffer = fs.readFileSync(csvFilePath);

      await request(app)
        .post('/api/v1/movies/import')
        .attach('file', fileBuffer, 'Movielist.csv')
        .expect(200);

      const response = await request(app)
        .get('/api/v1/movies/producer-award-intervals')
        .expect(200);

      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
      expect(Array.isArray(response.body.min)).toBe(true);
      expect(Array.isArray(response.body.max)).toBe(true);

      // Verifica o resultado máximo específico
      expect(response.body.max).toHaveLength(1);
      expect(response.body.max[0]).toEqual({
        producer: "Matthew Vaughn",
        interval: 13,
        previousWin: 2002,
        followingWin: 2015
      });

      // Verifica alguns produtores específicos do resultado mínimo
      const expectedProducers = [
        {
          producer: "Allan Carr",
          interval: 0,
          previousWin: 1980,
          followingWin: 1980
        },
        {
          producer: "Matthew Vaughn",
          interval: 0,
          previousWin: 2002,
          followingWin: 2002
        },
        {
          producer: "Debra Hayward",
          interval: 0,
          previousWin: 2019,
          followingWin: 2019
        }
      ];

      for (const expectedProducer of expectedProducers) {
        expect(response.body.min).toContainEqual(expectedProducer);
      }
    });
  });

  describe('PUT /api/v1/movies/:id', () => {
    it('deve atualizar um filme com sucesso', async () => {
      const movieData = {
        title: 'Test Movie',
        year: 2020,
        studios: 'Test Studios',
        producers: 'Test Producer',
        winner: false
      };

      const createResponse = await request(app)
        .post('/api/v1/movies')
        .send(movieData)  

      const updateData = {
        title: 'Updated Movie',
        year: 2021,
        studios: 'Updated Studios',
        producers: 'Updated Producer',
        winner: true
      };

      await request(app)
        .put(`/api/v1/movies/${createResponse.body.id}`)
        .send(updateData)
        .expect(200);

      const findMovie = await prisma.movie.findUnique({
        where: { id: createResponse.body.id }
      });

      expect(findMovie).not.toBeNull();
      expect(findMovie?.title).toBe(updateData.title);
      expect(findMovie?.year).toBe(updateData.year);
    });
  });

  describe('DELETE /api/v1/movies/:id', () => {
    it('deve deletar um filme com sucesso', async () => {
      const movieData = {
        title: 'Test Movie',
        year: 2020,
        studios: 'Test Studios',
        producers: 'Test Producer',
        winner: false
      };

      const createResponse = await request(app)
        .post('/api/v1/movies')
        .send(movieData)

      await request(app)
        .delete(`/api/v1/movies/${createResponse.body.id}`)
        .expect(200);

      const findMovie = await prisma.movie.findUnique({
        where: { id: createResponse.body.id }
      });

      expect(findMovie).toBeNull();
    });
  });
}); 