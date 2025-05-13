// src/services/mapAreaService.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '') + '/api/map-areas',
  withCredentials: true,
});

// ==========================
// 📂 Private Maps (MapArea)
// ==========================

export const createMapArea = async (data) => {
  const response = await API.post('/', data);

  const id = response.data?._id || response.data?.id;
  if (!id) throw new Error('Missing ID in createMapArea response');

  return { ...response, data: { ...response.data, _id: id } };
};

export const updateMapArea = (id, data) => API.put(`/${id}`, data);
export const getMapAreaById = (id) => API.get(`/${id}`);
export const getAllMapAreas = () => API.get('/');
export const deleteMapArea = (id) => API.delete(`/${id}`);

export const safeGetMapAreaById = async (id) => {
  try {
    return await getMapAreaById(id);
  } catch (error) {
    console.error('Failed to fetch map area:', error);
    throw error;
  }
};
