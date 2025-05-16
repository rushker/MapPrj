// controllers/projectController.js
import Project from '../models/Project.js';

// Create a new project
export const createProject = async (req, res) => {
  const { title } = req.body;
  try {
    const project = await Project.create({ title, areas: [] });
    res.status(201).json(project);
  } catch (err) {
    console.error('createProject error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Get all projects
export const getProjects = async (_req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    console.error('getProjects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    console.error('getProjectById error:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Update project (e.g., rename)
export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { title } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { title },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    console.error('updateProject error:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    console.error('deleteProject error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};