// services/axiosInstance.js
import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Có lỗi xảy ra';
    toast.error(message);

    // Nếu cần redirect khi 401:
    if (err.response?.status === 401) {
      // window.location.href = '/login'; // nếu có login
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
