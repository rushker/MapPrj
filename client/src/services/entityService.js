// src/services/entityService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/map-areas";

export const addEntityToArea = async (areaId, entityData) => {
  const response = await axios.post(`${BASE_URL}/${areaId}/entities`, entityData);
  return response.data;
};

export const updateEntity = async (areaId, entityId, updates) => {
  const response = await axios.put(`${BASE_URL}/${areaId}/entities/${entityId}`, updates);
  return response.data;
};

export const deleteEntity = async (areaId, entityId) => {
  const response = await axios.delete(`${BASE_URL}/${areaId}/entities/${entityId}`);
  return response.data;
};
