import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.toLowerCase().endsWith('.csv') || 
        file.mimetype !== 'text/csv') {
      return callback(new Error('Apenas arquivos CSV são permitidos'));
    }
    callback(null, true);
  }
});

export default upload; 