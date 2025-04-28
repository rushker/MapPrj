// server/middlewares/upload.js
import multer from 'multer';
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpe?g|png|gif|pdf/;
  const ok = allowed.test(file.mimetype.toLowerCase());
  cb(ok ? null : new Error('Only jpg, png, gif, pdf allowed'), ok);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
