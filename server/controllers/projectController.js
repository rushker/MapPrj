// controllers/projectController.js

import Project from '../models/Project.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('areas');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

export const createProject = async (req, res) => {
  try {
    const newProject = await Project.create({ name: req.body.name });
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
};
