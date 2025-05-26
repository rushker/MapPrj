///utils/routes.js

const FRONTEND_ORIGIN = process.env.ALLOWED_ORIGINS || 'https://map-prj.vercel.app';

export const ROUTES = {
  POST_MAP: (projectId, areaId) => `${FRONTEND_ORIGIN}/projects/${projectId}/areas/${areaId}/edit`,
  MANAGER_PAGE: `${FRONTEND_ORIGIN}/projects`,
  VIEW_MAP: (projectId, areaId) => `${FRONTEND_ORIGIN}/projects/${projectId}/areas/${areaId}/view`,
};

