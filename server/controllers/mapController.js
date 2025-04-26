// controllers/mapController.js
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMapImage(req, res, next) {
  try {
    const result = await cloudinary.v2.uploader.upload_stream(
      { folder: 'maps' },
      (error, result) => {
        if (error) return next(error);
        res.json({ url: result.secure_url });
      }
    );

    req.pipe(result);
  } catch (err) {
    next(err);
  }
}