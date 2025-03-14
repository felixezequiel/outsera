import { Request, Response, NextFunction } from 'express';
import { ApiVersion, LATEST_VERSION, isValidVersion } from '../config/api-versions';

export const versionControl = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers['accept-version'] as string || LATEST_VERSION;
  
  if (!isValidVersion(version)) {
    return res.status(400).json({
      error: `Versão inválida. Versões disponíveis: ${Object.values(ApiVersion).join(', ')}`
    });
  }

  req.apiVersion = version;
  next();
};

declare global {
  namespace Express {
    interface Request {
      apiVersion?: string;
    }
  }
} 