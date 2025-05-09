// src/services/privateMapApi.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '');
const API = `${baseURL}/api/map-areas`;

// ==========================
// 📂 Private Maps (MapArea) 
// ==========================

export const createMapArea = (polygon) => axios.post(API, { polygon });
export const updateMapArea = (id, data) => axios.put(`${API}/${id}`, data);
export const getMapAreaById = (id) => axios.get(`${API}/${id}`);
export const getAllMapAreas = () => axios.get(API);
export const deleteMapArea = (id) => axios.delete(`${API}/${id}`);
