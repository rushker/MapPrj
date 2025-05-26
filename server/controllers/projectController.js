// controllers/projectController.js

import Project from '../models/Project.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('areas');
    res.json({ success: true, data: projects });
  } catch (err) {
    handleError(res, 'Failed to fetch projects', err);
  }
};

export const createProject = async (req, res) => {
  try {
    const newProject = await Project.create({ name: req.body.name });
    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    handleError(res, 'Failed to create project', err, 400);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return handleNotFound(res, 'Project');

    // Xóa tất cả Areas thuộc Project
    await Area.deleteMany({ projectId: project._id });
    
    // Xóa tất cả Entities trong các Areas đó
    await Entity.deleteMany({ areaId: { $in: project.areas } });

    // Xóa Project
    await Project.findByIdAndDelete(req.params.projectId);
    
    res.json({ success: true, message: 'Project and related data deleted' });
  } catch (err) {
    handleError(res, 'Failed to delete project', err);
  }
};