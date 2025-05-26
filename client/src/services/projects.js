//services/projects.js
import axios from './axiosInstance';

export const getAllProjects = async () => {
  const res = await axios.get('/api/projects');
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await axios.post('/api/projects', projectData);
  return res.data;
};

export const deleteProject = async (projectId) => {
  const res = await axios.delete(`/api/projects/${projectId}`);
  return res.data;
};
