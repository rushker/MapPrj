// controllers/projectController.js
import Project from '../models/Project.js';
import Area from '../models/Area.js';
import Entity from '../models/Entity.js';
import { handleError, handleNotFound } from '../utils/errorHandler.js';

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
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return handleNotFound(res, 'Project');

    // 1) Delete all entities belonging to project's areas
    await Entity.deleteMany({ areaId: { $in: project.areas } });

    // 2) Delete all areas under the project
    await Area.deleteMany({ projectId });

    // 3) Delete the project itself
    await Project.findByIdAndDelete(projectId);

    return res.json({ success: true, message: 'Project and related data deleted' });
  } catch (err) {
    handleError(res, 'Failed to delete project', err);
  }
};
