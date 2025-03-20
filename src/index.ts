import { setupApp } from './main/config/app';
import { Server } from './main/config/server';

const app = setupApp();
const server = new Server(app);

// Exporta uma promessa que resolve para o app após a inicialização
export const appPromise = (async () => {
  await server.start();
  return app;
})();

// Para manter a compatibilidade com código existente
export default app;
