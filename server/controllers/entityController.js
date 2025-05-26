// controllers/entityController.js
import Entity from '../models/Entity.js';
import mongoose from 'mongoose';
import { handleError, handleNotFound } from '../utils/errorHandler.js';

export const createEntity = async (req, res) => {
  try {
    const { areaId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(areaId)) {
      return handleError(res, 'Invalid areaId', null, 400);
    }

    const { name, type, geometry, metadata = {}, images = [] } = req.body;
    if (!name || !type || !geometry?.type || !geometry?.coordinates) {
      return handleError(res, 'Missing required fields', null, 400);
    }

    const entity = new Entity({ name, type, geometry, metadata, images, areaId });
    await entity.save();
    res.status(201).json({ success: true, data: entity });
  } catch (err) {
    handleError(res, 'Failed to create entity', err);
  }
};

export const updateEntity = async (req, res) => {
  try {
    const { entityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(entityId)) {
      return handleError(res, 'Invalid entityId', null, 400);
    }

    const updated = await Entity.findByIdAndUpdate(entityId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return handleNotFound(res, 'Entity');
    res.json({ success: true, data: updated });
  } catch (err) {
    handleError(res, 'Failed to update entity', err, 400);
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
