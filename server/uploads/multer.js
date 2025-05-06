// uploads/multer.js
import multer from 'multer';
const storage = multer.diskStorage({}); // No destination = in-memory or temp
const upload = multer({ storage });

export default upload;
