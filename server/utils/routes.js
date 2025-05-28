// utils/routes.js
const FRONTEND_ORIGIN = process.env.ALLOWED_ORIGINS || 'https://map-prj.vercel.app';

export const ROUTES = {
  POST_MAP: (areaId) => `${FRONTEND_ORIGIN}/areas/${areaId}/edit`,
  VIEW_MAP: (areaId) => `${FRONTEND_ORIGIN}/areas/${areaId}/view`,
  MANAGER_PAGE: `${FRONTEND_ORIGIN}/areas`,
};
