//client/src/api/mapApi.js
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL + '/api';

export const fetchMaps    = () => axios.get(`${API}/maps`);
export const uploadMap    = formData => 
  axios.post(`${API}/maps`, formData, { headers: {'Content-Type':'multipart/form-data'} });

export const fetchAreas   = () => axios.get(`${API}/areas`);
export const uploadArea   = formData =>
  axios.post(`${API}/areas`, formData, { headers: {'Content-Type':'multipart/form-data'} });

