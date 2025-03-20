import { config } from 'dotenv';
import { setupApp } from './main/config/app';
import { Server } from './main/config/server';

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
