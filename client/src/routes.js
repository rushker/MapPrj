// src/routes.js

/**
 * Danh sách route sử dụng trong frontend.
 * - POST_MAP: trang tạo / chỉnh sửa Khu A, dùng chung 1 component (PostMapPage.jsx)
 * - MANAGER_PAGE: trang danh sách quản lý Khu A
 * - VIEW_MAP: trang xem Khu A công khai theo areaId
 */

export const ROUTES = {
  // Trang tạo / chỉnh sửa Khu A (PostMapPage.jsx)
  POST_MAP: '/areas/edit', // Không dùng areaId trên URL, areaId được lưu ở localStorage

  // Trang danh sách các Khu A đã tạo
  MANAGER_PAGE: '/',

  // Trang xem bản đồ công khai sau khi publish
  VIEW_MAP: (areaId) => `/areas/${areaId}/view`, // Chỉ sử dụng khi đã có areaId
};
