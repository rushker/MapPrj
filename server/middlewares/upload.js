// middlewares/uploadMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // or multer.diskStorage if needed

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValid = allowedTypes.test(file.mimetype.toLowerCase());
  if (isValid) cb(null, true);
  else cb(new Error('Only image files are allowed!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;

