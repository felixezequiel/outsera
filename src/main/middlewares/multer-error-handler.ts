import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

export const multerErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo permitido: 10MB' });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ error: 'Campo de arquivo inesperado' });
      default:
        return res.status(400).json({ error: 'Erro no upload do arquivo' });
    }
  }

  if (error.message === 'Apenas arquivos CSV são permitidos') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
}; 