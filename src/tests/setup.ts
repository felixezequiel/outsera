import { connectDatabase, cleanDatabase, closeDatabase } from '../infra/db/database';

// Aumenta o timeout dos testes para 10 segundos
jest.setTimeout(10000);

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await closeDatabase();
}); 