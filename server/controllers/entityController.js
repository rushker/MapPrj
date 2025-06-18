//controllers/entityControllers
import Entity from '../models/Entity.js';
import mongoose from 'mongoose';
import { handleError, handleNotFound } from '../utils/errorHandler.js';

export const createEntity = async (req, res) => {
  try {
    const { areaId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(areaId)) {
      return handleError(res, 'Invalid areaId', null, 400);
    }

    const { name, type, geometry, metadata = {} } = req.body;
    if (!name || !type || !geometry?.type || !geometry?.coordinates) {
      return handleError(res, 'Missing required fields', null, 400);
    }

    if (metadata.images && !Array.isArray(metadata.images)) {
      return handleError(res, '`metadata.images` must be an array', null, 400);
    }

    const entity = new Entity({ name, type, geometry, metadata, areaId });
    await entity.save();
    res.status(201).json({ success: true, data: entity });
  } catch (err) {
    handleError(res, 'Failed to create entity', err);
  }
};

export const updateEntity = async (req, res) => {
  try {
    const { areaId, entityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(entityId) || !mongoose.Types.ObjectId.isValid(areaId)) {
      return handleError(res, 'Invalid areaId or entityId', null, 400);
    }

    if (req.body.metadata?.images && !Array.isArray(req.body.metadata.images)) {
      return handleError(res, '`metadata.images` must be an array', null, 400);
    }

    const entity = await Entity.findOneAndUpdate(
      { _id: entityId, areaId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entity) return handleNotFound(res, 'Entity not found in this area');

    res.json({ success: true, data: entity });
  } catch (err) {
    handleError(res, 'Failed to update entity', err);
  }
};


export const updateEntityMetadata = async (req, res) => {
  try {
    const { areaId, entityId } = req.params;
    const { metadata } = req.body;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(entityId) || !mongoose.Types.ObjectId.isValid(areaId)) {
      return handleError(res, 'Invalid areaId or entityId', null, 400);
    }

    // Validate metadata
    if (typeof metadata !== 'object' || metadata === null) {
      return handleError(res, 'Metadata must be an object', null, 400);
    }

    // Validate images array
    if (metadata.images) {
      if (!Array.isArray(metadata.images)) {
        return handleError(res, '`metadata.images` must be an array', null, 400);
      }
      
      // Kiểm tra định dạng URL ảnh
      const isValidImage = metadata.images.every(url => 
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)
      );
      
      if (!isValidImage) {
        return handleError(res, 'Invalid image URL format', null, 400);
      }
    }

    // Tìm và cập nhật entity
    const entity = await Entity.findOneAndUpdate(
      { _id: entityId, areaId },
      { metadata },
      { new: true, runValidators: true }
    );

    if (!entity) return handleNotFound(res, 'Entity not found in this area');
    res.json({ success: true, data: entity });
  } catch (err) {
    handleError(res, 'Failed to update metadata', err);
  }
};


export const updateEntityGeometry = async (req, res) => {
  try {
    const { areaId, entityId } = req.params;
    const { geometry } = req.body;

    if (!mongoose.Types.ObjectId.isValid(entityId) || !mongoose.Types.ObjectId.isValid(areaId)) {
      return handleError(res, 'Invalid areaId or entityId', null, 400);
    }

    if (!geometry?.type || !geometry?.coordinates) {
      return handleError(res, 'Missing geometry fields', null, 400);
    }

    const entity = await Entity.findOne({ _id: entityId, areaId });
    if (!entity) return handleNotFound(res, 'Entity not found in this area');

    entity.geometry = geometry;
    await entity.save();

    res.json({ success: true, data: entity });
  } catch (err) {
    handleError(res, 'Failed to update geometry', err);
  }
};


export const deleteEntity = async (req, res) => {
  try {
    const { entityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(entityId)) {
      return handleError(res, 'Invalid entityId', null, 400);
    }

    const deleted = await Entity.findByIdAndDelete(entityId);
    if (!deleted) return handleNotFound(res, 'Entity');

    res.json({ success: true, message: 'Entity deleted' });
  } catch (err) {
    handleError(res, 'Failed to delete entity', err);
  }
};

export const getEntitiesByArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(areaId)) {
      return handleError(res, 'Invalid areaId', null, 400);
    }

    const entities = await Entity.find({ areaId });
    res.json({ success: true, data: entities });
  } catch (err) {
    handleError(res, 'Failed to fetch entities', err);
  }
};
