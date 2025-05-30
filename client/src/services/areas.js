// services/areas.js
//API cho Khu A
import axios from './axiosInstance';

/* ========= DÙNG CHUNG ========= */

// ✅ [ManagerPage.jsx] Lấy toàn bộ danh sách Khu A
// ✅ [PostMapPage.jsx] Dùng để redirect về danh sách sau khi tạo xong Khu A
export const getAllAreas = async () => {
  const res = await axios.get('/api/areas');
  return res.data;
};

/* ========= CHỈ DÙNG Ở PostMapPage.jsx ========= */

// ✅ Lấy thông tin chi tiết 1 Khu A theo ID
export const getAreaById = async (areaId) => {
  const res = await axios.get(`/api/areas/${areaId}`);
  return res.data;
};

// ✅ Tạo mới Khu A sau khi người dùng vẽ polygon xong
export const createArea = async (areaData) => {
  const res = await axios.post(`/api/areas`, areaData);
  return res.data;
};

// ✅ Cập nhật metadata Khu A (sau khi chỉnh sửa trong sidebar)
export const updateArea = async (areaId, areaData) => {
  const res = await axios.put(`/api/areas/${areaId}`, areaData);
  return res.data;
};

// ✅ Cập nhật polygon Khu A (sau khi chỉnh sửa vùng vẽ)
export const updateAreaPolygon = async (areaId, polygonData) => {
  const res = await axios.put(`/api/areas/${areaId}/polygon`, polygonData);
  return res.data;
};

// ✅ Publish Khu A
export const publishArea = async (areaId) => {
  const res = await axios.put(`/api/areas/${areaId}/publish`);
  return res.data;
};

// ✅ Tách Khu A thành các Khu C
export const cutAndCloneArea = async (areaId, polygonData) => {
  const res = await axios.post(`/api/areas/${areaId}/cut`, polygonData);
  return res.data;
};

/* ========= CHỈ DÙNG Ở ManagerPage.jsx ========= */

// ✅ Xóa 1 Khu A
export const deleteArea = async (areaId) => {
  const res = await axios.delete(`/api/areas/${areaId}`);
  return res.data;
};

// ✅ Tìm kiếm nâng cao (nếu ManagerPage cần filter theo tag, keyword,...)
export const searchAreas = async (query) => {
  const res = await axios.get(`/api/areas/search`, {
    params: { q: query }
  });
  return res.data;
};
