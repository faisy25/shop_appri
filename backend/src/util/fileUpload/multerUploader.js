import multer from 'multer';
import path from 'path';

// ===== MULTER FIXED STORAGE =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // keep uploads folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // KEEP EXTENSION
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

export const multerUploader = multer({ storage });
