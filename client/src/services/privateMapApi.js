// src/services/privateMapApi.js
import axios from 'axios';
const API = import.meta.env.VITE_BACKEND_URL;

export const getMapAreaById = async (id) => {
  const res = await axios.get(`${API}/api/map-areas/${id}`);
  return res.data;
};

export const updateMapArea = async (id, data) => {
  const res = await axios.put(`${API}/api/map-areas/${id}`, data);
  return res.data;
};
