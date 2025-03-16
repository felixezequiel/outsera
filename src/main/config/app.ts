import express from 'express';
import { setupRoutes } from '../routes';
import { versionControl } from '../middlewares/version-control';
import { multerErrorHandler } from '../middlewares/multer-error-handler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

export function setupApp() {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(versionControl);

  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rotas
  setupRoutes(app);

  // Error Handlers
  app.use(multerErrorHandler);

  return app;
} 