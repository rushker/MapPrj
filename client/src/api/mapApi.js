//client/src/api/mapApi.js
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL + '/api/maps';

export const uploadArea = async (formData) => {
  return await axios.post(API, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getAreas = async () => {
  return await axios.get(API);
};
