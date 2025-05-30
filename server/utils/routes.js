// utils/routes.js

/**
 * Danh sách route frontend được sử dụng để redirect từ backend (nếu cần)
 * - FRONTEND_ORIGIN là URL deploy chính thức của frontend
 */

const FRONTEND_ORIGIN = process.env.ALLOWED_ORIGINS || 'https://map-prj.vercel.app';

export const ROUTES = {
  // Trang tạo / chỉnh sửa Khu A (không gắn areaId trên URL)
  POST_MAP: `${FRONTEND_ORIGIN}/areas/edit`, // Luôn redirect về route này nếu user cần chỉnh sửa

  // Trang xem bản đồ công khai sau khi publish
  VIEW_MAP: (areaId) => `${FRONTEND_ORIGIN}/areas/${areaId}/view`,

  // Trang danh sách quản lý các Khu A
  MANAGER_PAGE: `${FRONTEND_ORIGIN}/`,
};
