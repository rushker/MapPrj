//services/api
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
