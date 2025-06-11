// contexts/AreaContext.jsx
import { createContext, useContext, useState } from 'react';

const AreaContext = createContext();

export function AreaProvider({ children,isEditMode = false }) {
  const [areaId, setAreaId] = useState(null);
  const [areaMetadata, setAreaMetadata] = useState(null);
  const [entities, setEntities] = useState([]);

  const value = {
    areaId,
    setAreaId,
    areaMetadata,
    setAreaMetadata,
    entities,
    setEntities,
    isEditMode,
   addEntity: (entity) => {
      if (!isEditMode) return; // Chỉ cho phép thêm entity khi ở chế độ chỉnh sửa
      setEntities(prev => [...prev, entity]);
    },
    updateEntity: (id, updates) => {
      if (!isEditMode) return; // Chỉ cho phép cập nhật khi ở chế độ chỉnh sửa
      setEntities(prev => prev.map(e => e._id === id ? {...e, ...updates} : e));
    },
    removeEntity: (id) => {
      if (!isEditMode) return; // Chỉ cho phép xóa khi ở chế độ chỉnh sửa
      setEntities(prev => prev.filter(e => e._id !== id));
    }
  };

  return <AreaContext.Provider value={value}>{children}</AreaContext.Provider>;
}

export const useAreaContext = () => useContext(AreaContext);