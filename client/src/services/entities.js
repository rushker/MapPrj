// services/entities.js
//API cho entity (Khu C / Marker)

import axios from './axiosInstance';

export const getEntitiesByArea = async (areaId) => {
  const res = await axios.get(`/api/areas/${areaId}/entities`);
  return res.data;
};

export const createEntity = async (areaId, entityData) => {
  const res = await axios.post(`/api/areas/${areaId}/entities`, entityData);
  return res.data;
};

export const updateEntity = async (areaId, entityId, entityData) => {
  const res = await axios.put(`/api/areas/${areaId}/entities/${entityId}`, entityData);
  return res.data;
};

export const deleteEntity = async (areaId, entityId) => {
  const res = await axios.delete(`/api/areas/${areaId}/entities/${entityId}`);
  return res.data;
};

export const updateEntityGeometry = async (entityId, geometry) => {
  const res = await axios.patch(`/api/entities/${entityId}/geometry`, { geometry });
  return res.data;
};

export const updateEntityMetadata = async (entityId, metadata) => {
  const res = await axios.patch(`/api/entities/${entityId}/metadata`, { metadata });
  return res.data;
};
