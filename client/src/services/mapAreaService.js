// src/services/mapAreaService.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '') + '/api/map-areas',
  withCredentials: true,
});

// ==========================
// 📂 Private Maps (MapArea)
// ==========================

export const createMapArea = (polygon) => API.post('/', { polygon });
export const updateMapArea = (id, data) => API.put(`/${id}`, data);
export const getMapAreaById = (id) => API.get(`/${id}`);
export const getAllMapAreas = () => API.get('/');
export const deleteMapArea = (id) => API.delete(`/${id}`);
export const safeGetMapAreaById = async (id) => {
  try {
    return await API.get(`/${id}`);
  } catch (err) {
    console.error('Failed to fetch map area', err);
    throw err;
  }
};