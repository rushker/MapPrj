// src/context/AreaContext.jsx
import { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const AreaContext = createContext();

export function AreaProvider({ children, isEditMode: forcedMode }) {
  const location = useLocation();

  // Auto detect nếu không truyền isEditMode
  const autoEdit = location.pathname.includes('/edit');
  const isEditMode = forcedMode ?? autoEdit;

  const [areaId, setAreaId] = useState(null);
  const [areaMetadata, setAreaMetadata] = useState(null);
  const [entities, setEntities] = useState([]);
  const [isCreatingArea, setIsCreatingArea] = useState(false);

  const value = {
    areaId,
    setAreaId,
    areaMetadata,
    setAreaMetadata,
    entities,
    setEntities,
    isCreatingArea,
    setIsCreatingArea,
    isEditMode,

    // Các hàm quản lý entity (chặn nếu không ở editMode)
    addEntity: (entity) => {
      if (!isEditMode || !areaId) return;
      setEntities(prev => [...prev, entity]);
    },
   
    updateEntityMetadata: (id, metadata) => {
      console.log("[Context] Updating entity metadata", { id, metadata });
      if (!isEditMode || !areaId) return;
      setEntities(prev =>
        prev.map(e => 
          e._id === id 
            ? { ...e, metadata } 
           : e)
        );
      },
    updateEntityGeometry: (id, geometry) => {
      if (!isEditMode || !areaId) return;
      setEntities(prev =>
        prev.map(e => 
          e._id === id 
            ? { ...e, geometry } 
            : e
          )
        );
      },
    removeEntity: (id) => {
      if (!isEditMode || !areaId) return;
      setEntities(prev => prev.filter(e => e._id !== id));
    },
  };

  return <AreaContext.Provider value={value}>{children}</AreaContext.Provider>;
}

export const useAreaContext = () => useContext(AreaContext);
