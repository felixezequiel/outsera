import { Request, Response, NextFunction } from 'express';
import { ApiVersion, LATEST_VERSION, isValidVersion } from '../config/api-versions';

export const versionControl = (req: Request, res: Response, next: NextFunction) => {
  const [_, pathVersion] = req.path.split('/')
  const headerVersion = req.headers['accept-version'] as string ?? req.headers['Accept-Version'] as string

  const isInvalid = (!headerVersion && !isValidVersion(pathVersion)) || (headerVersion && !isValidVersion(headerVersion))

  if (isInvalid) {
    return res.status(400).json({
      error: `Versão inválida. Versões disponíveis: ${Object.values(ApiVersion).join(', ')}`
    });
  }

  req.apiVersion = headerVersion || pathVersion || LATEST_VERSION;
  next();
};

declare global {
  namespace Express {
    interface Request {
      apiVersion?: string;
    }
  }
}