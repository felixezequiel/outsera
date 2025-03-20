import { config } from 'dotenv';
import { setupApp } from './main/config/app';
import { Server } from './main/config/server';

// Força uso de banco de dados em memória antes de carregar dotenv
process.env.DATABASE_URL = 'file::memory:?cache=shared';

// Carrega outras variáveis de ambiente
config();

const app = setupApp();
const server = new Server(app);

// Exporta o app diretamente para uso em produção
export const appInstance = app;

// Exporta uma promessa que resolve para o app após a inicialização
export const appPromise = (async () => {
  await server.start();
  return app;
})();

// Para manter a compatibilidade com código existente
export default app;
