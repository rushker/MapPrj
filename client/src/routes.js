// src/routes.js
export const ROUTES = {
  POST_MAP: (projectId, areaId) => `/projects/${projectId}/areas/${areaId}/edit`,
  MANAGER_PAGE: '/projects',
  VIEW_MAP: (projectId, areaId) => `/projects/${projectId}/areas/${areaId}/view`,
};
