import { Express, Router } from 'express';
import v1Routes from './v1';
import v2Routes from './v2';
import { ApiVersion } from '../config/api-versions';
import { versionControl } from '../middlewares/version-control';
import { createRouteMap } from '../config/route-version-map';

export const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  // Configura rotas para cada versão
  const v1Router = Router();
  const v2Router = Router();

  v1Routes(v1Router);
  v2Routes(v2Router);

  // Cria mapa de rotas
  const routeMap = createRouteMap(v1Router, v2Router);

  // Rotas versionadas via path
  router.use(`/${ApiVersion.V1}`, routeMap[ApiVersion.V1]);
  router.use(`/${ApiVersion.V2}`, routeMap[ApiVersion.V2]);

  // Middleware de controle de versão para rotas sem versão no path
  router.use(versionControl);
  
  // Rotas sem versão no path (usando header)
  router.use((req, res, next) => {
    const version = (req.apiVersion) as ApiVersion;
    routeMap[version](req, res, next);
  });
}; 