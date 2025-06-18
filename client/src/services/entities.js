// services/entities.js
import axios from './axiosInstance';

export const getEntitiesByArea = async (areaId) => {
  const res = await axios.get(`/api/areas/${areaId}/entities`);
  return res.data;
};

export const createEntity = async (areaId, entityData) => {
  const res = await axios.post(`/api/areas/${areaId}/entities`, entityData);
  return res.data;
};

export const updateEntity = async (areaId, entityId, entityData) => {
  const res = await axios.put(`/api/areas/${areaId}/entities/${entityId}`, entityData);
  return res.data;
};

export const deleteEntity = async (areaId, entityId) => {
  const res = await axios.delete(`/api/areas/${areaId}/entities/${entityId}`);
  return res.data;
};

// ✅ Updated: include areaId in route for verification
export const updateEntityGeometry = async (areaId, entityId, geometry) => {
  const res = await axios.patch(`/api/areas/${areaId}/entities/${entityId}/geometry`, { geometry });
  return res.data;
};

export const updateEntityMetadata = async (areaId, entityId, metadata) => {
   console.log("[API] Updating metadata for", { areaId, entityId, metadata });
  try {
    const res = await axios.patch(
      `/api/areas/${areaId}/entities/${entityId}/metadata`,
      { metadata },
      { timeout: 10000 }
    );
    
    if (!res.data.success) {
      throw new Error(res.data.message || 'Metadata update failed');
    }
    
    return res.data;
  } catch (err) {
    console.error(`Update metadata failed for entity ${entityId}:`, err);
    throw new Error(err.response?.data?.message || err.message);
  }
};