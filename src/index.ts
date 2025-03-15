import express from 'express';
import { config } from 'dotenv';
import { setupRoutes } from './main/routes';
import { connectDatabase, disconnectDatabase } from './infra/db/database';
import { versionControl } from './main/middlewares/version-control';
import { multerErrorHandler } from './main/middlewares/multer-error-handler';

config();

const app = express();

// Middlewares
app.use(express.json());
app.use(versionControl);

// Rotas
setupRoutes(app);

// Error Handlers
app.use(multerErrorHandler);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await disconnectDatabase();
    process.exit(1);
  }
}

// Gerenciamento de desligamento gracioso
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await disconnectDatabase();
  process.exit(0);
});

startServer();

export default app;
