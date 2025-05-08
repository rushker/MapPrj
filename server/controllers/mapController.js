// backend/controllers/mapController.js
import MapData from '../models/MapData.js';
import cloudinary from '../config/cloudinary.js';

// Utility same as above
const extractPublicId = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const withoutExt = pathname.replace(/\.[^/.]+$/, '');
    return withoutExt.startsWith('/') ? withoutExt.slice(1) : withoutExt;
  } catch (err) {
    console.warn('Failed to parse publicId from URL:', url, err.message);
    return null;
  }
};

// GET public map for ViewerPage
export const getMap = async (req, res) => {
  try {
    const map = await MapData.findById(req.params.id);
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.status(200).json(map);
  } catch (err) {
    console.error('Error in getMap:', err.message);
    res.status(500).json({ error: 'Failed to fetch map' });
  }
};

// SAVE finalized map (from EditPage publish)
export const saveMap = async (req, res) => {
  const { name, polygon, markers } = req.body;
  if (!polygon || !polygon.geometry) {
    return res.status(400).json({ error: 'Invalid polygon data' });
  }
  try {
    const newMap = await MapData.create({ name, polygon, markers });
    console.log(`Saved MapData ${newMap._id}`);
    res.status(201).json(newMap);
  } catch (err) {
    console.error('Error in saveMap:', err.message);
    res.status(500).json({ error: 'Failed to save map' });
  }
};

// UPDATE public map
export const updateMap = async (req, res) => {
  const { name, polygon, markers } = req.body;
  try {
    const updated = await MapData.findByIdAndUpdate(
      req.params.id,
      { name, polygon, markers },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Map not found' });
    console.log(`Updated MapData ${req.params.id}`);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error in updateMap:', err.message);
    res.status(500).json({ error: 'Failed to update map' });
  }
};

// UPLOAD image via Cloudinary
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const result = await cloudinary.uploader.upload(image, { folder: 'map-images' });
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Error in uploadImage:', err.message);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

// DELETE public map with image cleanup
export const deleteMapData = async (req, res) => {
  const { id } = req.params;
  try {
    const map = await MapData.findById(id);
    if (!map) return res.status(404).json({ error: 'Map not found' });
    await Promise.all(
      map.markers.map(async (m) => {
        if (m.imageUrl) {
          const publicId = extractPublicId(m.imageUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      })
    );
    await map.remove();
    console.log(`Deleted MapData ${id}`);
    res.status(200).json({ message: 'Map deleted successfully' });
  } catch (err) {
    console.error('Error in deleteMapData:', err.message);
    res.status(500).json({ error: 'Failed to delete map' });
  }
};
