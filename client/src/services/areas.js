// services/areas.js
import axios from './axiosInstance';

// Lấy thông tin 1 Khu A
export const getAreaById = async (projectId, areaId) => {
  const res = await axios.get(`/api/projects/${projectId}/areas/${areaId}`);
  return res.data;
};

// Tạo mới Khu A
export const createArea = async (projectId, areaData) => {
  const res = await axios.post(`/api/projects/${projectId}/areas`, areaData);
  return res.data;
};

// Cập nhật metadata Khu A
export const updateArea = async (projectId, areaId, areaData) => {
  const res = await axios.put(`/api/projects/${projectId}/areas/${areaId}`, areaData);
  return res.data;
};

// Xóa Khu A
export const deleteArea = async (projectId, areaId) => {
  const res = await axios.delete(`/api/projects/${projectId}/areas/${areaId}`);
  return res.data;
};

// Lấy danh sách tất cả Khu A theo project
export const getAreasByProject = async (projectId) => {
  const res = await axios.get(`/api/projects/${projectId}/areas`);
  return res.data;
};

// Tìm kiếm nâng cao theo từ khóa hoặc tag
export const searchAreas = async (projectId, query) => {
  const res = await axios.get(`/api/projects/${projectId}/areas/search`, {
    params: { q: query }
  });
  return res.data;
};

// Cập nhật lại polygon của Khu A
export const updateAreaPolygon = async (projectId, areaId, polygonData) => {
  const res = await axios.put(`/api/projects/${projectId}/areas/${areaId}/polygon`, polygonData);
  return res.data;
};

// Publish Khu A
export const publishArea = async (projectId, areaId) => {
  const res = await axios.put(`/api/projects/${projectId}/areas/${areaId}/publish`);
  return res.data;
};

// Cắt và nhân bản Khu A → Khu C
export const cutAndCloneArea = async (projectId, areaId, polygonData) => {
  const res = await axios.post(`/api/projects/${projectId}/areas/${areaId}/cut`, polygonData);
  return res.data;
};
