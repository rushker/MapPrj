// controllers/mapController.js
import { v2 as cloudinary } from 'cloudinary';

export async function uploadMapImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadFromBuffer = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'maps',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });
    };

    const result = await uploadFromBuffer(req.file.buffer);

    res.status(201).json({ 
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    next(err);
  }
}
export async function getMapImages(req, res, next) {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:maps')
      .sort_by('created_at','desc')
      .max_results(30)
      .execute();

    const images = resources.map(file => ({
      url: file.secure_url,
      public_id: file.public_id
    }));

    res.json({ success: true, images });
  } catch (err) {
    next(err);
  }
}

export async function deleteMapImage(req, res, next) {
  try {
    const { public_id } = req.params;
    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    next(err);
  }
}
