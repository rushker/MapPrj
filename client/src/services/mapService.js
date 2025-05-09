// src/services/mapService.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '') + '/api/maps',
  withCredentials: true,
});

// ==========================
// 📂 Public Maps (MapData)
// ==========================

export const getMap = (id) => API.get(`/${id}`);
export const saveMap = (mapData) => API.post('/', mapData);
export const updateMap = (id, mapData) => API.put(`/${id}`, mapData);
export const deleteMap = (id) => API.delete(`/${id}`);

// ==========================
// 📦 Utility: Upload Image
// ==========================

export const uploadImage = (base64Image) => API.post('/upload-image', { image: base64Image });
