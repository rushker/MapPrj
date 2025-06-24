//src/services/nominatim.js
import axios from 'axios';

// Tìm kiếm địa điểm từ từ khóa location (query string)
export const searchLocation = async (query) => {
  const res = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: query,
      format: 'json',
      addressdetails: 1,
      limit: 5,
    },
    headers: {
      'Accept-Language': 'vi',
    },
  });

  return res.data; // danh sách gợi ý
};

// Reverse geocoding: từ lat, lon -> địa chỉ
export const reverseLocation = async ({ lat, lon }) => {
  const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: {
      lat,
      lon,
      format: 'json',
      addressdetails: 1,
    },
  });

  return res.data; // thông tin địa chỉ đầy đủ
};
