import { prisma, connectDatabase, disconnectDatabase } from '../infra/db/database';

beforeAll(async () => {
  await connectDatabase();
});

beforeEach(async () => {
  // Limpa todas as tabelas antes de cada teste
  await prisma.movie.deleteMany();
});

afterAll(async () => {
  await prisma.movie.deleteMany();
  await disconnectDatabase();
}); 