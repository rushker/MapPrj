// src/services/api.js
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL;

// ==========================
// 📂 Public Maps (MapData)
// ==========================

export const getAllMaps = async () => {
  const res = await axios.get(`${API}/api/maps`);
  return res.data;
};

export const getMapById = async (id) => {
  const res = await axios.get(`${API}/api/maps/${id}`);
  return res.data;
};

export const createMap = async (data) => {
  const res = await axios.post(`${API}/api/maps`, data);
  return res.data;
};

export const updateMapData = async (id, data) => {
  const res = await axios.put(`${API}/api/maps/${id}`, data);
  return res.data;
};

export const deleteMap = async (id) => {
  const res = await axios.delete(`${API}/api/maps/${id}`);
  return res.data;
};

// ==========================
// 📦 Utility: Upload Image
// ==========================

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post(`${API}/api/upload`, formData);
  return res.data.imageUrl;
};
