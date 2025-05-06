//src/services/api
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL;

export const getMapById = (id) => axios.get(`${API}/api/maps/${id}`).then(res => res.data);

export const updateMapData = (id, data) => axios.put(`${API}/api/maps/${id}`, data);

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post(`${API}/api/upload`, formData);
  return res.data.imageUrl;
};

export const getAllMaps = async () => {
  try {
    const res = await axios.get(`${API}/api/maps`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch maps:', err);
    throw new Error('Failed to fetch maps');
  }
};

export const deleteMap = async (id) => {
  try {
    const res = await axios.delete(`${API}/api/maps/${id}`);
    return res.data;
  } catch (err) {
    console.error('Failed to delete map:', err);
    throw new Error('Failed to delete map');
  }
};
