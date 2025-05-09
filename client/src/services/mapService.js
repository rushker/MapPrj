// src/services/mapService.js
import axios from 'axios';

const API = `${import.meta.env.VITE_BACKEND_URL}/api/maps`;

// ==========================
// 📂 Public Maps (MapData)
// ==========================

export const getMap = (id) => axios.get(`${API}/${id}`);
export const saveMap = (mapData) => axios.post(API, mapData);
export const updateMap = (id, mapData) => axios.put(`${API}/${id}`, mapData);
export const deleteMap = (id) => axios.delete(`${API}/${id}`);
// ==========================
// 📦 Utility: Upload Image
// ==========================

export const uploadImage = (base64Image) => axios.post(`${API}/upload-image`, { image: base64Image });
