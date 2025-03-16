import express from 'express';
import { setupRoutes } from '../routes';
import { multerErrorHandler } from '../middlewares/multer-error-handler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

export function setupApp() {
  const app = express();

  // Middlewares
  app.use(express.json());

  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rotas
  setupRoutes(app);

  // Error Handlers
  app.use(multerErrorHandler);

  return app;
} 