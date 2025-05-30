// services/entities.js
//API cho entity (Khu C / Marker)

import axios from './axiosInstance';

// Lấy tất cả entity của 1 area
export const getEntitiesByArea = async (areaId) => {
  const res = await axios.get(`/api/areas/${areaId}/entities`);
  return res.data;
};

// Tạo entity mới
export const createEntity = async (areaId, entityData) => {
  const res = await axios.post(`/api/areas/${areaId}/entities`, entityData);
  return res.data;
};

// Cập nhật entity
export const updateEntity = async (areaId, entityId, entityData) => {
  const res = await axios.put(`/api/areas/${areaId}/entities/${entityId}`, entityData);
  return res.data;
};

// Xóa entity
export const deleteEntity = async (areaId, entityId) => {
  const res = await axios.delete(`/api/areas/${areaId}/entities/${entityId}`);
  return res.data;
};

