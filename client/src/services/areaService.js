// src/services/areaService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/map-areas";

export const getAllAreas = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getAreaById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createArea = async (areaData) => {
  const response = await axios.post(BASE_URL, areaData);
  return response.data;
};

export const updateArea = async (id, updates) => {
  const response = await axios.put(`${BASE_URL}/${id}`, updates);
  return response.data;
};

export const deleteArea = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
