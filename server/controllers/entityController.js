// controllers/entityController.js
import Entity from '../models/Entity.js';

export const createEntity = async (req, res) => {
  try {
    const newEntity = new Entity({ ...req.body, areaId: req.params.areaId });
    await newEntity.save();
    res.status(201).json(newEntity);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create entity' });
  }
};

export const updateEntity = async (req, res) => {
  try {
    const updated = await Entity.findByIdAndUpdate(req.params.entityId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update entity' });
  }
};

export const deleteEntity = async (req, res) => {
  try {
    await Entity.findByIdAndDelete(req.params.entityId);
    res.status(200).json({ message: 'Entity deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entity' });
  }
};

export const getEntitiesByArea = async (req, res) => {
  try {
    const entities = await Entity.find({ areaId: req.params.areaId });
    res.json(entities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entities' });
  }
};
