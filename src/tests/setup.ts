import { prisma } from '../infra/db/database';

// Aumenta o timeout dos testes para 10 segundos
jest.setTimeout(10000);

// Limpa o banco de dados e reseta as conexões antes de todos os testes
beforeAll(async () => {
  await prisma.$connect();
});

// Limpa o banco de dados e fecha as conexões depois de todos os testes
afterAll(async () => {
  await prisma.$transaction([
    prisma.movie.deleteMany()
  ]);
  await prisma.$disconnect();
}); 